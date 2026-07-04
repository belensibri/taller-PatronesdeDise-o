# Plan de Implementación: 04-update.md (Actualizar un Post — PUT / PATCH /posts/:id)

## 1. Alcance (Scope)

### Qué hace:

- Expone dos endpoints para modificar una publicación existente:
  - `PUT /posts/:id` — **Actualización completa**: reemplaza todos los campos editables del post.
  - `PATCH /posts/:id` — **Actualización parcial**: actualiza solo los campos enviados en el body.
- Valida que el post exista antes de aplicar cambios; si no existe, devuelve `404 NOT_FOUND`.
- Actualiza automáticamente el campo `updated_at` en cada modificación (gestionado por TypeORM `@UpdateDateColumn`).
- Rechaza cualquier intento de modificar un post cuyo `status` sea `trash` — primero debe restaurarse.
- Valida que los campos enviados cumplan con las restricciones del modelo (tipos, longitud, enum de status).
- Devuelve el post actualizado como respuesta `200 OK`.

### Qué NO hace:

- No implementa autenticación ni autorización.
- No genera automáticamente el `slug` si no se envía.
- No restaura posts en `trash` (eso corresponde a otra operación).
- No realiza operaciones de creación ni eliminación.

---

## 2. Criterios de Aceptación (Acceptance Criteria)

### Contrato del Endpoint

- **Rutas:** `PUT /posts/:id` y `PATCH /posts/:id`
- **Parámetro de ruta:** `id` (UUID del post)

| Campo     | Tipo            | Requerido en PUT | Requerido en PATCH |
| --------- | --------------- | ---------------- | ------------------ |
| title     | string          | Sí               | No                 |
| content   | string          | Sí               | No                 |
| excerpt   | string / null   | Sí               | No                 |
| slug      | string          | Sí               | No                 |
| status    | enum PostStatus | Sí               | No                 |
| author_id | integer         | Sí               | No                 |

### Respuesta Exitosa `200 OK`

```json
{
  "id": "uuid-del-post",
  "title": "Título actualizado",
  "content": "Contenido actualizado",
  "excerpt": "Resumen...",
  "slug": "titulo-actualizado",
  "status": "publish",
  "author_id": 1,
  "created_at": "2026-07-01T10:00:00.000Z",
  "updated_at": "2026-07-03T12:00:00.000Z"
}
```

### Respuestas de Error

| Situación                            | HTTP | Código de error    |
| ------------------------------------ | ---- | ------------------ |
| Post no encontrado                   | 404  | `NOT_FOUND`        |
| Post en estado `trash`               | 422  | `UNPROCESSABLE`    |
| Campos inválidos / tipos incorrectos | 400  | `VALIDATION_ERROR` |

Formato estándar de errores (definido en Foundation):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "El recurso solicitado no existe."
  }
}
```

---

## 3. Tareas de Implementación

### 3.1 DTO: `UpdatePostDto`

**Archivo:** `src/posts/dto/update-post.dto.ts` [NUEVO]

Crear el DTO que valida el body de la petición. Todos los campos son `@IsOptional()` para soportar PATCH.

```typescript
import { IsOptional, IsString, IsEnum, IsInt, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../entities/post.entity';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  excerpt?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  author_id?: number;
}
```

---

### 3.2 Servicio: `PostsService.update()`

**Archivo:** `src/posts/posts.service.ts` [MODIFICAR]

Agregar el método `update(id: string, dto: UpdatePostDto)`:

1. Buscar el post por `id` con `findOne({ where: { id } })`.
2. Si no existe → lanzar `NotFoundException` (404) con código `NOT_FOUND`.
3. Si `post.status === PostStatus.TRASH` → lanzar `UnprocessableEntityException` (422) con código `UNPROCESSABLE`.
4. Aplicar los campos del DTO sobre el post con `Object.assign(post, dto)`.
5. Guardar con `postRepository.save(post)` (TypeORM actualiza `updated_at` automáticamente).
6. Retornar el post guardado.

```typescript
async update(id: string, dto: UpdatePostDto): Promise<Post> {
  const post = await this.postRepository.findOne({ where: { id } });

  if (!post) {
    throw new NotFoundException({
      error: { code: 'NOT_FOUND', message: 'El recurso solicitado no existe.' }
    });
  }

  if (post.status === PostStatus.TRASH) {
    throw new UnprocessableEntityException({
      error: { code: 'UNPROCESSABLE', message: 'No se puede modificar un post en estado trash.' }
    });
  }

  Object.assign(post, dto);
  return this.postRepository.save(post);
}
```

---

### 3.3 Controlador: `PostsController`

**Archivo:** `src/posts/posts.controller.ts` [MODIFICAR]

Agregar dos endpoints usando `@Put` y `@Patch`:

```typescript
@Put(':id')
update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
  return this.postsService.update(id, dto);
}

@Patch(':id')
partialUpdate(@Param('id') id: string, @Body() dto: UpdatePostDto) {
  return this.postsService.update(id, dto);
}
```

Ambos invocan el mismo método del servicio; el DTO maneja la opcionalidad de campos.

---

### 3.4 Tests Unitarios: `PostsService`

**Archivo:** `src/posts/posts.service.spec.ts` [MODIFICAR]

Agregar bloque `describe('update')` con los siguientes casos:

| Test | Resultado esperado |
|------|--------------------|
| Post encontrado y actualizado | Retorna el post con los nuevos valores |
| Post no encontrado | Lanza `NotFoundException` |
| Post en estado `trash` | Lanza `UnprocessableEntityException` |
| Actualización parcial (PATCH) | Solo modifica los campos enviados |

Mock necesario en el repositorio:
- `findOne`: devuelve un post existente o `null`
- `save`: devuelve el post modificado

---

### 3.5 Tests de Integración: `PostsController`

**Archivo:** `src/posts/posts.controller.spec.ts` [MODIFICAR]

Agregar casos para `PUT` y `PATCH`:

| Caso | Ruta | HTTP esperado |
|------|------|---------------|
| PUT exitoso | `PUT /posts/:id` | 200 |
| PATCH exitoso | `PATCH /posts/:id` | 200 |
| ID inexistente | `PUT /posts/no-existe` | 404 + error estándar |
| Post en trash | `PATCH /posts/:id` | 422 + error estándar |
| Body inválido | `PUT /posts/:id` body mal formado | 400 + VALIDATION_ERROR |

---

## 4. Restricciones

- El campo `id` es UUID de solo lectura; no puede enviarse en el body.
- El campo `updated_at` es gestionado por TypeORM; no debe enviarse en el body.
- El campo `created_at` es de solo lectura; no puede modificarse.
- No se puede actualizar un post en estado `trash` → responder `422`.
- Respetar el formato estándar de errores: `{ error: { code, message } }`.

---

## 5. Archivos a Modificar / Crear

| Acción  | Archivo                                      | Descripción                               |
| ------- | -------------------------------------------- | ----------------------------------------- |
| [NUEVO] | `src/posts/dto/update-post.dto.ts`           | DTO de validación para el body del update |
| [MOD]   | `src/posts/posts.service.ts`                 | Agregar método `update()`                 |
| [MOD]   | `src/posts/posts.controller.ts`              | Agregar endpoints `PUT` y `PATCH`         |
| [MOD]   | `src/posts/posts.service.spec.ts`            | Tests unitarios del servicio              |
| [MOD]   | `src/posts/posts.controller.spec.ts`         | Tests de integración del controlador      |

---

## 6. Fuera de Alcance

- Autenticación y autorización.
- Auto-generación del slug.
- Restauración de posts en `trash`.
- Validaciones avanzadas de transición de estado (ej. solo publicar si title y content no están vacíos).
- Paginación, búsqueda y filtros.

---

## 7. Plan de Verificación

### Tests Automatizados

```bash
# Ejecutar todos los tests
npx jest

# Solo tests del módulo posts
npx jest posts

# Modo watch durante desarrollo
npx jest --watch
```

### Verificación Manual

1. `npm run start:dev` — arrancar la aplicación.
2. `PUT /posts/:id` con body completo → esperar `200` con el post actualizado.
3. `PATCH /posts/:id` con solo `title` → esperar `200` con solo el título cambiado.
4. `PUT /posts/uuid-inexistente` → esperar `404` + formato de error estándar.
5. `PATCH /posts/:id` (post en trash) → esperar `422` + formato de error estándar.
6. `PUT /posts/:id` con `status: "invalido"` → esperar `400` + `VALIDATION_ERROR`.
