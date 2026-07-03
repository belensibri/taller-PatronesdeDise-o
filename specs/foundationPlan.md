# Spec 0 — Foundation (Plan)

## Contexto

Antes de desarrollar los endpoints del CMS es necesario establecer una base técnica común sobre la cual se construirán las siguientes funcionalidades (Index, Show, Store, Update y Delete).

Este Foundation tiene como objetivo preparar la infraestructura inicial del proyecto utilizando **NestJS**, **TypeORM** y **PostgreSQL**, definiendo el modelo de datos del recurso **Post**, la conexión con la base de datos, una estructura de módulos escalable y un formato estándar para el manejo de errores.

Al finalizar este spec, el proyecto deberá estar listo para comenzar la implementación de los endpoints REST sin requerir cambios en la arquitectura base.

---

# Plan de implementación

## 1. Inicialización del proyecto

### Objetivo

Crear la estructura base del proyecto utilizando NestJS.

### Tareas

* Inicializar un proyecto con NestJS.
* Configurar TypeScript.
* Instalar las dependencias necesarias.
* Configurar variables de entorno.
* Crear la estructura inicial de módulos.

### Criterios de aceptación

* El proyecto compila sin errores.
* El servidor inicia correctamente.
* Existe una ruta de Health Check (`GET /health`) que responde HTTP 200.
* La configuración utiliza variables de entorno para la conexión a la base de datos.

---

## 2. Configuración de PostgreSQL y TypeORM

### Objetivo

Configurar la persistencia de datos mediante PostgreSQL y TypeORM.

### Tareas

* Instalar TypeORM.
* Configurar el DataSource.
* Configurar PostgreSQL como base de datos.
* Configurar migraciones.
* Verificar la conexión.

### Criterios de aceptación

* La aplicación establece conexión con PostgreSQL al iniciar.
* Las migraciones pueden ejecutarse correctamente.
* La configuración de TypeORM utiliza variables de entorno.
* No existen credenciales hardcodeadas en el proyecto.

---

## 3. Modelo Post

### Objetivo

Definir el modelo base que utilizarán todas las funcionalidades posteriores.

### Tareas

Crear la entidad **Post** con los siguientes campos:

| Campo      | Tipo             |
| ---------- | ---------------- |
| id         | UUID             |
| title      | varchar          |
| content    | text             |
| excerpt    | varchar nullable |
| slug       | varchar          |
| status     | enum             |
| author_id  | integer          |
| created_at | timestamp        |
| updated_at | timestamp        |

Definir el enum:

```text
draft
pending
publish
private
trash
```

### Criterios de aceptación

* Existe una entidad `Post`.
* Existe una migración que crea la tabla `posts`.
* La tabla contiene únicamente los campos definidos.
* El campo `status` utiliza el enum especificado.
* La migración puede ejecutarse sin errores.

---

## 4. Formato estándar de errores

### Objetivo

Garantizar que todas las respuestas de error compartan la misma estructura.

### Tareas

* Implementar un Exception Filter global.
* Definir el formato JSON estándar para errores.
* Configurar el filtro como global.

Formato esperado:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

### Criterios de aceptación

* Cualquier excepción HTTP devuelve el formato definido.
* No existen respuestas HTML.
* Los códigos HTTP originales se conservan.

---

## 5. Configuración del framework

### Objetivo

Dejar preparada la arquitectura para las siguientes especificaciones.

### Tareas

Crear la estructura base de módulos.

```text
src/
│
├── app.module.ts
├── main.ts
│
├── common/
│   ├── filters/
│   ├── exceptions/
│   └── dto/
│
├── config/
│
├── database/
│   ├── migrations/
│   └── datasource.ts
│
├── health/
│
└── posts/
    ├── entities/
    ├── dto/
    ├── posts.module.ts
    ├── posts.controller.ts
    └── posts.service.ts
```

### Criterios de aceptación

* La aplicación sigue la arquitectura modular de NestJS.
* Existe un módulo `Posts`.
* Existe un módulo `Health`.
* La estructura permite agregar nuevas funcionalidades sin reorganizar el proyecto.

---

# Alcance

Este plan incluye:

* Configuración inicial de NestJS.
* Configuración de PostgreSQL.
* Integración con TypeORM.
* Variables de entorno.
* Modelo `Post`.
* Migración inicial.
* Exception Filter global.
* Ruta `/health`.
* Arquitectura base del proyecto.

---

# Fuera de alcance

Este Foundation no implementa:

* Crear posts.
* Listar posts.
* Obtener un post.
* Actualizar posts.
* Eliminar posts.
* Validaciones de negocio.
* Autenticación.
* Autorización.
* Paginación.
* Búsquedas.
* Generación automática del slug.
* Lógica del ciclo de vida del post.

---

# Restricciones

* El framework debe ser **NestJS**.
* La persistencia debe implementarse con **TypeORM**.
* La base de datos debe ser **PostgreSQL**.
* El identificador del recurso `Post` será de tipo **UUID**.
* Todas las migraciones deberán gestionarse mediante **TypeORM Migrations**.
* La conexión a la base de datos utilizará variables de entorno.
* La estructura del recurso `Post` será el contrato base para las siguientes especificaciones y no podrá modificarse durante este spec.
* Todos los errores de la API deberán seguir el formato JSON definido por el Exception Filter global.

---

# Entregables

Al finalizar este Foundation deberán estar disponibles:

* Proyecto NestJS funcional.
* Configuración de TypeORM con PostgreSQL.
* Entidad `Post`.
* Migración inicial de la tabla `posts`.
* Enum de estados (`draft`, `pending`, `publish`, `private`, `trash`).
* Exception Filter global con formato de error estandarizado.
* Endpoint `GET /health` respondiendo correctamente.
* Estructura modular preparada para implementar las siguientes especificaciones del CMS.
