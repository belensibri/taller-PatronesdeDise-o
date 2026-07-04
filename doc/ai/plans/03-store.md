---

# spec 3 - Store

---

# Spec

/superpowers brainstorming

Feature Crear un post (Store)

Contexto: Estás dentro de una API CRUD para gestionar publicaciones (posts), inspirada en las reglas mínimas de la REST API de WordPress. Los editores necesitan publicar o guardar borradores de contenido nuevo desde la API.

## Criterios de aceptación:
Testing:
-	Debe seguir Test Driven Development (TDD).
-	Los tests deben estar versionados junto al código y deben validar el funcionamiento de todos los criterios de aceptacion.

Parámetros aceptados (Payload):
-	title (string, requerido)
-	content (string, requerido)
-	excerpt (string, opcional)
-	slug (string, opcional)
-	status (string, opcional, por defecto: "draft". Valores válidos: "draft", "publish", "pending", "private").
-	author_id (UUID/Entero, requerido).

Reglas de Negocio (Store):
-	POST /posts con title y content (independientemente del estado) → Devuelve 201 Created y el post creado.
-	Si falta title o content en el payload → Devuelve 422 Unprocessable Entity con un JSON estándar indicando el campo que falló.
-	Si no se envía el parámetro status, se asume "draft".
-	Si el payload incluye status: "publish", el sistema asigna el published_at con el timestamp exacto de la creación. Si el estado es "draft" (o cualquier otro), el published_at debe guardarse como null.
-	Si no se incluye un slug en el payload, el sistema lo autogenera a partir del title.
-	Debe devolver el recurso completo con respuesta exitosa 201 incluyendo todos los campos manejados por el sistema: id, created_at, updated_at y published_at (ya sea con su fecha o en null)
- Debe estar integrada en la arquitectura actual del proyecto

## Fuera de alcance:
-	Subida de imágenes 
-	Autenticación de autor 
-	Implementar otros módulos fuera del POST 
-	Implementar Wordpress

# Plan

Plan: Crear Post (Store)

Summary
Implementar POST /posts en NestJS siguiendo TDD, integrado al módulo actual de posts, con validación 422, generación de slug, estado por defecto draft, manejo de published_at y respuesta 201 Created con el recurso completo.

Cambios Clave
Agregar un DTO de creación para validar:
title, content y author_id requeridos; excerpt, slug y status opcionales.
Validar status solo con:
draft, publish, pending, private.
No aceptar trash en Store.
Mantener author_id como entero, alineado con la entidad y migración actuales.
Agregar published_at nullable en la entidad Post y en la migración de posts.
Agregar POST /posts en PostsController, delegando la creación a PostsService.
En PostsService.create:usar draft si no viene status;
generar slug desde title si no viene;
asignar published_at = new Date() solo cuando status === "publish";
asignar published_at = null para los demás estados;
guardar usando el repositorio TypeORM.
Ajustar la validación global para responder 422 Unprocessable Entity.
Extender el error estándar con error.details para indicar los campos fallidos sin romper error.code y error.message.

Test Plan
Crear tests antes de implementar la lógica.
Cubrir casos exitosos:POST /posts con payload mínimo devuelve 201.
status por defecto es draft.
slug se genera desde title cuando no se envía.
slug enviado se respeta.
status: "publish" asigna published_at.
draft, pending y private guardan published_at: null.
respuesta incluye id, created_at, updated_at y published_at.
Cubrir validaciones:falta title devuelve 422 e indica title.
falta content devuelve 422 e indica content.
falta author_id devuelve 422 e indica author_id.
status inválido devuelve 422 e indica status.
status: "trash" devuelve 422.
Usar mocks del repositorio/servicio para no depender de PostgreSQL en tests automatizados.

Assumptions
Antes de ejecutar pruebas/build hará falta instalar dependencias con npm install; actualmente node_modules no está disponible.
No se implementará autenticación de autor.
No se implementará resolución de colisiones de slug duplicado; la restricción única existente queda como protección de base de datos.
No se implementarán otros endpoints CRUD fuera de POST /posts.