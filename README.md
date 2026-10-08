# S10 · API HTTP validada con cliente React

Aplicación full stack para administrar medicamentos. El backend NestJS conserva los datos en memoria, valida cada entrada y publica su contrato OpenAPI. El frontend React consume ese contrato y actualiza la interfaz únicamente con respuestas confirmadas por la API.

## Tecnologías

- Node.js 20 o superior
- NestJS 11, `class-validator` y Swagger/OpenAPI
- React 19, TypeScript y Vite
- Jest y Supertest para pruebas E2E

## Ejecución local

```bash
git clone https://github.com/gesteb3/-S10-API-HTTP-validada-con-cliente-React.git
cd -S10-API-HTTP-validada-con-cliente-React
npm install
npm run dev
```

Servicios disponibles:

- Frontend: http://localhost:5173
- API: http://localhost:3000/api
- Swagger UI: http://localhost:3000/docs

El origen CORS permitido por defecto es exactamente `http://localhost:5173`. Puede cambiarse con la variable `FRONTEND_ORIGIN`. El frontend acepta `VITE_API_URL`; consulte [`frontend/.env.example`](frontend/.env.example).

> Los datos viven en memoria y se reinician al detener el backend; esto es intencional para la demostración.

## Contrato HTTP

| Método | Ruta | Resultado exitoso | Errores esperados |
| --- | --- | --- | --- |
| `GET` | `/api/medicines` | `200` lista | — |
| `GET` | `/api/medicines/:id` | `200` recurso | `400` UUID inválido, `404` inexistente |
| `POST` | `/api/medicines` | `201` recurso creado | `400` cuerpo inválido, `409` SKU duplicado |
| `PATCH` | `/api/medicines/:id` | `200` recurso actualizado | `400`, `404`, `409` |
| `DELETE` | `/api/medicines/:id` | `204` sin cuerpo | `400`, `404` |

No se implementa `PUT`: la actualización es parcial mediante `PATCH`. El identificador es UUID y el SKU se normaliza a mayúsculas.

### Cuerpo de creación

```json
{
  "name": "Paracetamol 500 mg",
  "sku": "PAR-500",
  "price": 3.5,
  "stock": 25,
  "requiresPrescription": false
}
```

`name` y `sku` tienen límites de longitud; `price` debe ser positivo y admitir como máximo dos decimales; `stock` debe ser un entero no negativo; `requiresPrescription` debe ser booleano. Propiedades desconocidas producen `400 Bad Request`.

### Forma de errores

NestJS produce respuestas consistentes con sus excepciones estándar, sin escribir respuestas manuales con `@Res()`:

```json
{
  "message": ["property unexpected should not exist"],
  "error": "Bad Request",
  "statusCode": 400
}
```

Los códigos se usan con esta semántica:

- `200 OK`: lectura o modificación correcta.
- `201 Created`: la API creó y devolvió un nuevo recurso.
- `204 No Content`: eliminación correcta, sin cuerpo de respuesta.
- `400 Bad Request`: UUID, tipos, restricciones o propiedades no permitidas inválidas.
- `404 Not Found`: no existe un medicamento con ese UUID.
- `409 Conflict`: el SKU solicitado ya pertenece a otro medicamento.

## Calidad y verificación

```bash
npm run build
npm run lint
npm run test:e2e -w backend
```

La prueba E2E recorre validación `400`, creación `201`, conflicto `409`, actualización/consulta `200`, eliminación `204` y posterior ausencia `404`.

## Estructura

```text
backend/
  src/medicines/
    dto/                  # DTO de creación y actualización parcial
    entities/             # Forma documentada del recurso
    medicines.controller.ts
    medicines.service.ts  # almacenamiento en memoria y reglas de negocio
    medicines.module.ts
frontend/
  src/
    api.ts                 # cliente HTTP y normalización de errores
    MedicineForm.tsx
    App.tsx
```

## Guion sugerido para el video (máximo 3 minutos)

1. **0:00–0:25** — Mostrar el repositorio y abrir Swagger en `/docs`.
2. **0:25–0:50** — Desde Swagger enviar un `POST` inválido con una propiedad desconocida y señalar el `400`.
3. **0:50–1:25** — Abrir React y crear un medicamento; en Network mostrar `POST`, estado `201` y respuesta.
4. **1:25–1:55** — Editar existencias; mostrar `PATCH`, estado `200` y respuesta.
5. **1:55–2:25** — Intentar crear el mismo SKU; mostrar el mensaje de interfaz y `409` en Network.
6. **2:25–2:45** — Eliminar el registro y mostrar `DELETE 204`.
7. **2:45–3:00** — Recordar que el PDF contiene los enlaces públicos del video y repositorio.

Antes de entregar, abra el enlace de Google Drive en una ventana privada para comprobar que se puede visualizar sin solicitar acceso.

