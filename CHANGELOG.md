# Changelog

## 2026-07-14

### Integracion frontend con API real

- Se reemplazo el login mock por `POST /api/auth/login`.
- Se agrego persistencia de sesion en `localStorage`:
  - `rentaya_token`
  - `rentaya_user`
- Se agrego interceptor HTTP para enviar `Authorization: Bearer <token>` en requests `/api/*`.
- Se agrego manejo de `401` en el interceptor para limpiar sesion y redirigir a `/login`.
- Se conecto perfil con `GET /api/users/me` y `PATCH /api/users/me`.
- Se reemplazo el servicio mock de propiedades por endpoints reales:
  - `GET /api/properties`
  - `GET /api/properties/{id}`
  - `GET /api/properties/me`
  - `POST /api/properties`
  - `PUT /api/properties/{id}`
  - `DELETE /api/properties/{id}`
- Se reemplazo favoritos en `localStorage` por API real:
  - `GET /api/favorites`
  - `POST /api/favorites/{propertyId}`
  - `DELETE /api/favorites/{propertyId}`
- Se reemplazo visitas mock por API real:
  - `POST /api/visits`
  - `GET /api/visits/owner`
  - `GET /api/visits/tenant`
  - `PATCH /api/visits/{id}/status`
- Se reemplazo mensajeria mock por API real:
  - `GET /api/conversations`
  - `POST /api/conversations`
  - `GET /api/conversations/{id}/messages`
  - `POST /api/conversations/{id}/messages`

### Ajustes de UI y validaciones

- Se elimino el banner de credenciales demo del login.
- Se elimino el selector mock de rol del navbar.
- Se bloqueo la publicacion/edicion de propiedades para usuarios no autenticados.
- Se bloqueo la publicacion/edicion de propiedades para usuarios que no sean `PROPIETARIO`.
- Se agregaron mensajes claros para errores `401`, `403`, `400` y errores generales al guardar propiedades.
- Se agrego mensaje de error real en el listado de propiedades cuando falla la carga desde backend.
- Se conserva el mensaje "No se encontraron propiedades" solo para respuestas exitosas con arreglo vacio.

### Documentacion

- Se agrego `docs/front/GUIA_FRONTEND_API.md` como guia vigente de integracion frontend/API.
- Se limpio documentacion temporal de backend que ya no aplica al estar implementada la integracion.
- Se creo `docs/COMMIT_NOTES.md` con resumen de cambios y mensaje sugerido para commit.

### Verificacion

- `ng build`: correcto.
- `ng test --watch=false`: correcto, 16 tests pasan.
- Pruebas manuales por proxy Angular:
  - Registro de usuario.
  - Login.
  - Crear propiedad como propietario.
  - Bloqueo de crear propiedad como inquilino con `403`.
  - Listado y filtros de propiedades.
  - Favoritos.
  - Solicitud de visita.
  - Conversacion y envio de mensaje.
