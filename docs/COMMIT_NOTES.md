# Notas para commit

## Rama

```text
feature/EmirSanchez
```

## Mensaje sugerido

```text
feat: integrar frontend con API real de Rentaya
```

## Resumen corto

Se reemplazan los servicios mock principales por llamadas HTTP reales al backend, se agrega manejo de sesion JWT, se conectan los modulos de propiedades, favoritos, visitas y mensajes, y se mejora el manejo visible de errores en login, listado y publicacion de propiedades.

## Cambios incluidos

### Autenticacion y sesion

- Nuevo interceptor en `src/app/services/auth.interceptor.ts`.
- `app.config.ts` registra `provideHttpClient(withInterceptors([authInterceptor]))`.
- `AuthService` ahora expone:
  - `register`
  - `login`
  - `logout`
  - `me`
  - `updateMe`
- `SessionService` persiste token y usuario en `localStorage`.
- `SessionService` limpia sesion local al cerrar sesion.
- Ante `401`, el interceptor limpia sesion y redirige a `/login`.

### Login y perfil

- `LoginComponent` consume `POST /api/auth/login`.
- Se remueve el banner de credenciales demo.
- `ProfileComponent` consume `PATCH /api/users/me`.

### Propiedades

- `PropertyService` consume API real para listar, obtener detalle, crear, actualizar y eliminar.
- El formulario de propiedades valida:
  - sesion activa;
  - rol `PROPIETARIO`;
  - permisos y errores del backend.
- El listado de propiedades muestra error de carga si falla backend/proxy.
- Los filtros envian query params `district`, `minPrice` y `maxPrice`.

### Favoritos

- `FavoriteService` consume API real.
- Se elimina persistencia mock en `localStorage`.
- Se mantiene `favoriteIds` como estado local derivado de la respuesta backend.

### Visitas

- `VisitService` consume API real para:
  - solicitar visita;
  - listar visitas del propietario;
  - listar visitas del inquilino;
  - actualizar estado.

### Mensajes

- `MessageService` consume API real para:
  - listar conversaciones;
  - obtener/crear conversacion por propiedad;
  - listar mensajes;
  - enviar mensaje.

### Navbar

- Se elimina selector demo de rol.
- Se mantiene navegacion segun rol del usuario autenticado.

### Documentacion

- `CHANGELOG.md` registra los cambios.
- `docs/front/GUIA_FRONTEND_API.md` queda como guia vigente.
- Se eliminan documentos temporales de backend ya implementados/obsoletos.

## Validacion realizada

```bash
npm exec --yes --package node@24.18.0 -- node node_modules/@angular/cli/bin/ng.js build
npm exec --yes --package node@24.18.0 -- node node_modules/@angular/cli/bin/ng.js test --watch=false
```

Resultado:

- Build correcto.
- Tests correctos: 16 tests pasan.

## Pruebas manuales realizadas

- Backend activo en `http://localhost:8080/`.
- Frontend activo en `http://127.0.0.1:4200/`.
- Registro de propietario.
- Login de propietario.
- Creacion de propiedad como propietario.
- Intento de creacion de propiedad como inquilino: backend responde `403` y frontend muestra error de permisos.
- Listado de propiedades.
- Filtro por distrito.
- Filtro por precio minimo y maximo.
- Favorito.
- Solicitud de visita.
- Creacion de conversacion.
- Envio de mensaje.

## Archivos principales modificados

- `src/app/app.config.ts`
- `src/app/services/auth.interceptor.ts`
- `src/app/services/auth.service.ts`
- `src/app/services/session.service.ts`
- `src/app/services/property.service.ts`
- `src/app/services/favorite.service.ts`
- `src/app/services/visit.service.ts`
- `src/app/services/message.service.ts`
- `src/app/pages/login/login.component.ts`
- `src/app/pages/login/login.html`
- `src/app/pages/profile/profile.ts`
- `src/app/pages/properties/property-form/property-form.ts`
- `src/app/pages/properties/properties-list/properties-list.ts`
- `src/app/pages/properties/properties-list/properties-list.html`
- `src/app/pages/favorites/favorites.ts`
- `src/app/shared/navbar/navbar.ts`
- `src/app/shared/navbar/navbar.html`
- `docs/front/GUIA_FRONTEND_API.md`
- `CHANGELOG.md`
