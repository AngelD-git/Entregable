import { TestBed } from '@angular/core/testing';
import { AlmacenamientoService } from './almacenamiento.service';
import { FavoritosService } from './favoritos.service';
import { NoticiasService } from './noticias.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('Persistencia defensiva', () => {
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({}); });
  afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

  it.each(['{roto', '{}'])('avisa por datos corruptos (%s) sin sobrescribirlos', (valor) => {
    localStorage.setItem('prueba', valor);
    const almacen = TestBed.inject(AlmacenamientoService);
    expect(almacen.leerLista('prueba')).toEqual([]);
    expect(almacen.aviso()).not.toBe('');
    expect(localStorage.getItem('prueba')).toBe(valor);
  });

  it('tolera lectura bloqueada y falla explícitamente al escribir', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Security'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Security'); });
    const almacen = TestBed.inject(AlmacenamientoService);
    expect(almacen.leerLista('prueba')).toEqual([]);
    expect(almacen.guardarLista('prueba', ['1'])).toBe(false);
  });

  it('limpia duplicados/IDs corruptos y conserva favoritos tras recrear el servicio', () => {
    localStorage.setItem('infonexia_favoritos', JSON.stringify(['1', '1', null, {}, 'uabc', '../2']));
    const servicio = TestBed.inject(FavoritosService);
    expect(servicio.ids()).toEqual(['1', 'uabc']);
    servicio.alternar('2');
    TestBed.resetTestingModule();
    const recargado = TestBed.inject(FavoritosService);
    expect(recargado.ids()).toEqual(['1', 'uabc', '2']);
    expect(recargado.vaciar()).toBe(true);
    expect(JSON.parse(localStorage.getItem('infonexia_favoritos')!)).toEqual([]);
  });

  it('no vacía favoritos si el almacenamiento está bloqueado', () => {
    const servicio = TestBed.inject(FavoritosService);
    servicio.alternar('1');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Quota'); });
    expect(servicio.vaciar()).toBe(false);
    expect(servicio.ids()).toEqual(['1']);
  });

  it('recupera noticias locales válidas y omite registros corruptos tras recarga', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const noticias = TestBed.inject(NoticiasService);
    TestBed.inject(HttpTestingController).expectOne('data/noticias.json').flush([]);
    const id = noticias.crear({ categoria: 'Educación', titulo: 'Local', resumen: 'Texto', autor: 'Prueba', contenido: 'Contenido' });
    const guardadas = JSON.parse(localStorage.getItem('infonexia_noticias_creadas')!);
    localStorage.setItem('infonexia_noticias_creadas', JSON.stringify([...guardadas, guardadas[0], {}]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const recargado = TestBed.inject(NoticiasService);
    TestBed.inject(HttpTestingController).expectOne('data/noticias.json').flush([]);
    expect(recargado.todas()).toHaveLength(1);
    expect(recargado.porId(String(id))?.titulo).toBe('Local');
  });
});
