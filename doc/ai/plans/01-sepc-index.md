# Plan de Implementación: 01-index.md (Listar Posts con Filtros y Paginación)

## 1. Alcance (Scope)

### Qué hace:
- Expone un endpoint público mediante el método `GET /posts`.
- Recupera una colección de publicaciones desde la base de datos aplicando de forma combinada los siguientes filtros mediante Query Parameters:
  - **Paginación:** `page` y `per_page`.
  - **Búsqueda por texto:** `search` (busca coincidencias en el título o contenido).
  - **Filtrado por Estado:** `status` (ej. `publish`, `future`, `draft`, `pending`, `private`, `trash`). Por defecto, si no se envía, solo muestra `publish` y excluye `trash` (a menos que se pida explícitamente y el usuario tenga permisos).
  - **Filtrado por Autor:** `author` (ID del usuario creador).
  - **Ordenamiento:** `orderby` (columna por la cual ordenar, ej. `date`, `title`, `id`) y `order` (dirección del orden: `asc` o `desc`).
- Devuelve una estructura JSON consistente que incluye los datos en la clave `data` y los metadatos de paginación/totales en `meta`.
- Valida estrictamente todos los tipos de datos de los parámetros de consulta antes de tocar la base de datos.

### Qué NO hace:
- No maneja la lógica de autenticación o validación de roles en este archivo (asume que los middleware de seguridad ya proveen el contexto si se requiere ver estados privados).
- No realiza operaciones de escritura o mutación (POST, PUT, DELETE).

---

## 2. Criterios de Aceptación (Acceptance Criteria)

### Contrato del Endpoint
- **Ruta:** `GET /posts`
- **Query Parameters Soportados:**
  - `page` (Opcional, por defecto `1`): Entero mayor o igual a 1.
  - `per_page` (Opcional, por defecto `10`): Entero entre 1 y 100.
  - `search` (Opcional): String. Filtra posts cuyo título o contenido contengan este texto.
  - `status` (Opcional, por defecto `'publish'`): String restringido a un ENUM de estados válidos de WordPress API.
  - `author` (Opcional): Entero que representa el `author_id`.
  - `orderby` (Opcional, por defecto `'date'`): String restringido a valores como `id`, `title`, `slug`, `date`.
  - `order` (Opcional, por defecto `'desc'`): String restringido estrictamente a `asc` o `desc`.

### Estructura de Respuesta Exitosa (200 OK)
```json
{
  "data": [
    {
      "id": 12,
      "title": "Estrategias de Patrones de Diseño",
      "slug": "estrategias-de-patrones-de-diseno",
      "excerpt": "Una introducción...",
      "content": "Contenido completo...",
      "status": "publish",
      "author_id": 3,
      "created_at": "2026-07-03T11:00:00.000Z",
      "updated_at": "2026-07-03T11:00:00.000Z",
      "published_at": "2026-07-03T11:00:00.000Z"
    }
  ],
  "meta": {
    "total_items": 1,
    "per_page": 10,
    "current_page": 1,
    "total_pages": 1
  }
}