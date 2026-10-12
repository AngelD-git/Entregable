import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { NoticiasService } from '../services/noticias.service';
import { FavoritosService } from '../services/favoritos.service';

describe('Flujos de páginas con router real', () => {
  let harness: RouterTestingHarness;
  let noticias: NoticiasService;
  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(), provideHttpClientTesting()] });
    noticias = TestBed.inject(NoticiasService);
    TestBed.inject(HttpTestingController).expectOne('data/noticias.json').flush(Array.from({ length: 9 }, (_, i) => ({
      id: String(i + 1), categoria: i % 2 ? 'Educación' : 'Tecnología', titulo: 'Noticia ' + (i + 1),
      resumen: 'Resumen', contenido: 'Contenido completo', autor: 'Prueba', fecha: '2026-08-10', imagen: 'img/noticia-1.jpg',
    })));
    harness = await RouterTestingHarness.create();
  });
  afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });
  function campo(id: string, valor: string): void {
    const input = harness.routeNativeElement!.querySelector<HTMLInputElement>(id)!;
    input.value = valor;
    input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    harness.detectChanges();
  }
  function boton(texto: string): HTMLButtonElement {
    return [...harness.routeNativeElement!.querySelectorAll('button')].find((b) => b.textContent!.trim() === texto)!;
  }

  it('renderiza las seis vistas y maneja detalle/ruta inexistentes', async () => {
    for (const url of ['/', '/noticias', '/nosotros', '/favoritos', '/contacto', '/noticia/1']) {
      await harness.navigateByUrl(url);
      expect(harness.routeNativeElement!.querySelector('h1')).not.toBeNull();
    }
    await harness.navigateByUrl('/noticia/no-existe');
    expect(harness.routeNativeElement!.textContent).toContain('No se encontró');
    await harness.navigateByUrl('/ruta-no-existe');
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('limita páginas, conserva orden en URL y limpia filtros', async () => {
    await harness.navigateByUrl('/noticias?pagina=999&orden=za');
    expect(harness.routeNativeElement!.querySelector('[role=status]')!.textContent).toContain('Página 2 de 2');
    expect(harness.routeNativeElement!.querySelectorAll('app-noticia-card')).toHaveLength(3);
    await harness.navigateByUrl('/noticias?categoria=Educaci%C3%B3n&q=Noticia&orden=az');
    expect(harness.routeNativeElement!.querySelectorAll('app-noticia-card')).toHaveLength(4);
    boton('Limpiar filtros').click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/noticias');
  });

  it('crea y edita por formulario, cancela sin sobreescribir y protege noticias base', async () => {
    await harness.navigateByUrl('/noticias');
    expect(boton('Editar')).toBeUndefined();
    campo('#nueva-categoria', 'Tecnología'); campo('#nuevo-autor', 'Prueba'); campo('#nuevo-titulo', 'Nueva local');
    campo('#nuevo-resumen', 'Resumen local'); campo('#nuevo-contenido', 'Texto local');
    boton('Guardar en este navegador').click();
    await harness.fixture.whenStable(); harness.detectChanges();
    const local = noticias.todas().find((n) => n.titulo === 'Nueva local')!;
    expect(local).toBeDefined();
    boton('Editar').click(); harness.detectChanges();
    campo('#nuevo-titulo', 'Título editado');
    boton('Guardar cambios').click(); await harness.fixture.whenStable(); harness.detectChanges();
    expect(noticias.porId(local.id)?.titulo).toBe('Título editado');
    boton('Editar').click(); harness.detectChanges(); campo('#nuevo-titulo', 'No guardado');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    boton('Cancelar edición').click(); harness.detectChanges();
    expect(noticias.porId(local.id)?.titulo).toBe('Título editado');
  });

  it('contacto rechaza correo inválido, confirma validación local y conserva el texto', async () => {
    await harness.navigateByUrl('/contacto');
    campo('#nombre','Prueba'); campo('#apellido','Ejemplo'); campo('#correo','correo@'); campo('#asunto','Consulta'); campo('#mensaje','Mensaje de prueba');
    boton('Validar mensaje de prueba').click(); harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('Ingresa un correo electrónico válido');
    expect(harness.routeNativeElement!.querySelector('.mensaje-confirmacion.visible')).toBeNull();
    campo('#correo','prueba@example.org'); boton('Validar mensaje de prueba').click(); harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('.mensaje-confirmacion.visible')!.textContent).toContain('No se ha enviado');
    expect((harness.routeNativeElement!.querySelector('#mensaje') as HTMLTextAreaElement).value).toBe('Mensaje de prueba');
  });

  it('filtra favoritos y respeta cancelación del vaciado', async () => {
    const favoritos = TestBed.inject(FavoritosService);
    favoritos.alternar('1'); favoritos.alternar('2');
    await harness.navigateByUrl('/favoritos');
    campo('#buscar-favoritos', 'Noticia 1');
    expect(harness.routeNativeElement!.querySelectorAll('app-noticia-card')).toHaveLength(1);
    const confirmar = vi.spyOn(window,'confirm').mockReturnValue(false);
    boton('Vaciar favoritos').click(); harness.detectChanges();
    expect(favoritos.ids()).toHaveLength(2);
    confirmar.mockReturnValue(true); boton('Vaciar favoritos').click(); harness.detectChanges();
    expect(favoritos.ids()).toHaveLength(0);
  });
});
