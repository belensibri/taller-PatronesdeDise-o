<<<<<<< Updated upstream
# CMS Foundation - NestJS

Este proyecto corresponde al Foundation del CMS de posts y deja preparada la base para implementar los endpoints REST posteriores.

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL (opcional para la ejecución base del health check)

## Instalar dependencias

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
DB_ENABLED=false
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=cms_foundation
DB_SSL=false
```

> Si deseas conectar PostgreSQL, cambia `DB_ENABLED=true` y asegúrate de que la base exista.

## Ejecutar en modo desarrollo

```bash
npm run start:dev
```

## Ejecutar en modo producción

```bash
npm run build
npm run start:prod
```

## Verificar salud de la API
```bash
npm install @nestjs/terminus

La aplicación expone el endpoint:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{ "status": "ok" }
```

## Compilar el proyecto

```bash
npm run build
```

## Ejecutar pruebas

```bash
npm test
```

## Estructura principal

```text
src/
├── app.module.ts
├── main.ts
├── common/
│   └── filters/
├── database/
├── health/
└── posts/
    ├── entities/
    ├── posts.controller.ts
    ├── posts.module.ts
    └── posts.service.ts
```

## Características incluidas

- NestJS base configurado
- Health check en `GET /health`
- Filtro global de errores
- Módulos `Health` y `Posts`
- Entidad `Post` preparada para TypeORM
- Migración base lista para PostgreSQL

## Siguiente paso

Una vez que el Foundation esté listo, el siguiente trabajo es implementar los endpoints CRUD del recurso Post.
=======
# CMS Foundation

## Update de posts

Esta sección documenta la funcionalidad de update para los posts.

### Endpoints disponibles

- PUT /posts/:id: actualización completa del post.
- PATCH /posts/:id: actualización parcial del post.

### Ejemplo de solicitud

PUT /posts/00000000-0000-0000-0000-000000000001

```json
{
  "title": "Título actualizado",
  "content": "Contenido actualizado",
  "excerpt": "Resumen actualizado",
  "slug": "titulo-actualizado",
  "status": "publish",
  "author_id": 1
}
```

PATCH /posts/00000000-0000-0000-0000-000000000001

```json
{
  "title": "Solo cambio el título"
}
```

### Comportamiento

- Si el post no existe, responde con 404 y un error con código `NOT_FOUND`.
- Si el post está en estado `trash`, responde con 422 y un error con código `UNPROCESSABLE`.
- Si el body contiene datos inválidos, responde con 400 y un error con código `VALIDATION_ERROR`.
>>>>>>> Stashed changes
