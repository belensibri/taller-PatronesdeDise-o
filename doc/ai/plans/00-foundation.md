---

# Spec 0 — Foundation

## Contexto

Actualmente no existe una base estandarizada para desarrollar la API del CMS de posts. Antes de implementar las operaciones CRUD es necesario definir una estructura común que sirva como contrato para todas las funcionalidades posteriores.

Este specification está dirigido al equipo de desarrollo del backend y busca establecer un modelo de datos consistente, un formato uniforme para las respuestas de error y una configuración inicial del proyecto que facilite la implementación de las siguientes especificaciones (Index, Show, Store, Update y Delete).

---

# Casos de uso / Criterios de aceptación

### Caso de uso 1: Inicializar el proyecto

**Como desarrollador**, quiero disponer de una estructura base del proyecto para comenzar el desarrollo de la API.

**Criterios de aceptación**

* Existe una aplicación ejecutable.
* Existe una ruta de prueba (Health Check) que responde:

  * HTTP 200
  * JSON válido.
* La aplicación inicia sin errores de configuración.

---

### Caso de uso 2: Definir el modelo Post

**Como desarrollador**, quiero contar con un modelo único de Post para que todas las funcionalidades utilicen la misma estructura de datos.

**Criterios de aceptación**

El modelo contiene los siguientes campos:

| Campo      | Tipo            |
| ---------- | --------------- |
| id         | integer/uuid    |
| title      | string          |
| content    | text            |
| excerpt    | string nullable |
| slug       | string          |
| status     | enum            |
| author_id  | integer         |
| created_at | datetime        |
| updated_at | datetime        |

El campo **status** únicamente acepta:

* draft
* pending
* publish
* private
* trash

---

### Caso de uso 3: Estandarizar errores

**Como desarrollador**, quiero que todas las respuestas de error tengan el mismo formato para simplificar el consumo de la API.

**Criterios de aceptación**

Toda respuesta de error devuelve un JSON con la estructura:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

No se permiten respuestas HTML.

---

### Caso de uso 4: Preparar la infraestructura para las siguientes especificaciones

**Como desarrollador**, quiero que el proyecto tenga el ruteo base configurado para implementar posteriormente los endpoints del recurso Post.

**Criterios de aceptación**

* Existe un grupo de rutas para `/posts`.
* La configuración permite agregar endpoints REST posteriormente.
* La aplicación puede ejecutarse sin implementar todavía operaciones CRUD.

---

# Alcance

Este specification incluye:

* Configuración inicial del framework.
* Configuración del proyecto.
* Modelo Post.
* Migración o esquema de base de datos.
* Enumeración de estados válidos.
* Definición del formato estándar de errores.
* Ruta de Health Check.

---

# Fuera de alcance

Este specification **no** incluye:

* Crear posts.
* Listar posts.
* Obtener un post.
* Actualizar posts.
* Eliminar posts.
* Autenticación.
* Autorización.
* Validaciones de negocio.
* Paginación.
* Generación automática del slug.
* Reglas del ciclo de vida del post.
* Filtros o búsquedas.

---

# Restricciones

## Modelo de datos

El recurso **Post** debe contener únicamente los siguientes atributos:

```text
id
title
content
excerpt
slug
status
author_id
created_at
updated_at
```

No deben agregarse atributos adicionales en este specification.

---

## Estados válidos

El atributo **status** únicamente puede tomar alguno de los siguientes valores:

```text
draft
pending
publish
private
trash
```

---

## Formato de errores

Todos los errores de la API deberán responder utilizando el mismo formato JSON.

Ejemplo:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El recurso contiene datos inválidos."
  }
}
```

---

## Compatibilidad

El modelo definido en este specification será el contrato base para las siguientes especificaciones:

* Spec 1 — Index
* Spec 2 — Show
* Spec 3 — Store
* Spec 4 — Update
* Spec 5 — Delete

Ninguna especificación posterior podrá modificar la estructura del recurso Post sin una actualización explícita del Foundation.

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
