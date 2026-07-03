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
