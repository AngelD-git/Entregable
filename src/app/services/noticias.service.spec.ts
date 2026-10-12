import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoticiasService, noticiaValida, idValido } from './noticias.service';
import { FavoritosService } from './favoritos.service';
import { AlmacenamientoService } from './almacenamiento.service';
import { Noticia, NuevaNoticia } from '../models/noticia.model';

const datos: NuevaNoticia = { categoria: 'Tecnología', autor: 'Prueba', titulo: 'Título', resumen: 'Resumen', contenido: 'Contenido' };
const base: Noticia = { ...datos, id: '1', fecha: '2026-08-10', imagen: 'img/noticia-1.jpg' };

describe('Catálogo y noticias locales', () => {
  let servicio: NoticiasService;
  let http: HttpTestingController;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(NoticiasService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); vi.restoreAllMocks(); localStorage.clear(); });

  it('carga JSON relativo y rechaza fechas imposibles, IDs u objetos inválidos', () => {
    expect(servicio.cargando()).toBe(true);
    http.expectOne('data/noticias.json').flush([base]);
    expect(servicio.porId('1')).toEqual(base);
    expect(servicio.cargando()).toBe(false);
    expect(noticiaValida({ ...base, fecha: '2026-02-30' })).toBe(false);
    expect(idValido({ toString: () => '1' })).toBe(false);
    expect(servicio.porId('../1')).toBeUndefined();
  });

  it('expone fallo HTTP y permite reintentar, rechaza duplicados', () => {
    http.expectOne('data/noticias.json').flush('error', { status: 500, statusText: 'Error' });
    expect(servicio.error()).toBe(true);
    servicio.cargar();
    http.expectOne('data/noticias.json').flush([base, base]);
    expect(servicio.error()).toBe(true);
    servicio.cargar();
    http.expectOne('data/noticias.json').flush([base]);
    expect(servicio.error()).toBe(false);
  });

  it('crea, edita conservando ID/fecha/favoritos, persiste y elimina sin tocar el catálogo', () => {
    http.expectOne('data/noticias.json').flush([base]);
    const id = servicio.crear(datos);
    expect(typeof id).toBe('string');
    if (!id) throw new Error('No se creó');
    const original = servicio.porId(id)!;
    const favoritos = TestBed.inject(FavoritosService);
    favoritos.alternar(id);
    expect(servicio.actualizar(id, { ...datos, titulo: 'Editado' })).toBe(true);
    expect(servicio.porId(id)?.fecha).toBe(original.fecha);
    expect(favoritos.esFavorito(id)).toBe(true);
    expect(JSON.parse(localStorage.getItem('infonexia_noticias_creadas')!)[0].titulo).toBe('Editado');
    expect(servicio.actualizar('1', datos)).toBe(false);
    expect(servicio.eliminar('1')).toBe(false);
    expect(servicio.eliminar(id)).toBe(true);
    expect(favoritos.esFavorito(id)).toBe(false);
    expect(servicio.porId('1')).toEqual(base);
  });

  it('no cambia el estado ni pierde la noticia cuando se deniega guardar', () => {
    http.expectOne('data/noticias.json').flush([]);
    const id = servicio.crear(datos);
    if (!id) throw new Error('No se creó');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota'); });
    expect(servicio.actualizar(id, { ...datos, titulo: 'No guardado' })).toBe(false);
    expect(servicio.eliminar(id)).toBe(false);
    expect(servicio.porId(id)?.titulo).toBe(datos.titulo);
    expect(TestBed.inject(AlmacenamientoService).aviso()).toContain('No se guardó');
  });

  it('rechaza alta inválida sin escribir almacenamiento', () => {
    http.expectOne('data/noticias.json').flush([]);
    const guardar = vi.spyOn(Storage.prototype, 'setItem');
    expect(servicio.crear({ ...datos, titulo: ' ' })).toBe(false);
    expect(guardar).not.toHaveBeenCalled();
  });
});
