Actúa como un arquitecto de software senior especializado en NestJS, TypeScript y diseño de APIs REST escalables.

Necesito implementar los endpoints **SHOW (GET por id)** y **DELETE** dentro de una API desarrollada con NestJS.

## Objetivo

Implementar ambos endpoints siguiendo una arquitectura limpia, código mantenible y buenas prácticas de NestJS.

## Requisitos de arquitectura

Aplica estrictamente los siguientes principios:

- SOLID
- Clean Architecture
- Separation of Concerns
- Clean Code
- Principio DRY
- KISS
- Dependency Injection propia de NestJS
- Alta cohesión y bajo acoplamiento

## Requisitos de implementación

Para ambos endpoints debes:

- Mantener la arquitectura existente del proyecto.
- No introducir lógica de negocio dentro del Controller.
- Toda la lógica debe residir en el Service.
- Utilizar el Repository/ORM ya existente.
- No duplicar código.
- Reutilizar métodos privados cuando sea conveniente.
- Mantener consistencia con el resto del módulo.

## Endpoint SHOW

Implementar un endpoint que:

- Obtenga un registro mediante su id.
- Devuelva únicamente la información necesaria.
- Si el recurso no existe, lanzar la excepción HTTP adecuada utilizando las excepciones nativas de NestJS.
- Validar correctamente el parámetro recibido.
- Mantener una respuesta consistente con el resto de la API.

## Endpoint DELETE

Implementar un endpoint que:

- Elimine un registro mediante su id.
- Antes de eliminar, validar que el recurso exista.
- Si no existe, lanzar la excepción correspondiente.
- Si la eliminación es exitosa, devolver la respuesta HTTP más apropiada siguiendo las convenciones REST.
- Si existe lógica de borrado lógico (soft delete), utilizarla; de lo contrario, realizar eliminación física.

## Buenas prácticas

Asegúrate de:

- Utilizar decoradores oficiales de NestJS.
- Aplicar tipado fuerte en todo momento.
- Evitar código repetido.
- Escribir métodos pequeños y con una única responsabilidad.
- Nombrar variables y métodos de forma clara y consistente.
- Mantener la legibilidad del código como prioridad.
- Evitar cualquier implementación innecesaria.

## Documentación

Si el proyecto utiliza Swagger:

- Agregar los decoradores correspondientes para documentar ambos endpoints.

## Resultado esperado

Genera únicamente el código necesario para integrar ambos endpoints respetando la estructura actual del proyecto.

Antes de escribir cualquier código:

1. Analiza la arquitectura existente.
2. Identifica qué archivos deben modificarse.
3. Explica brevemente por qué cada cambio es necesario.
4. Después genera el código completo de cada archivo modificado.
5. Explica cualquier decisión de diseño que hayas tomado.

No modifiques código que no esté relacionado con estos endpoints.
No simplifiques la implementación.
Prioriza mantenibilidad, extensibilidad y consistencia sobre escribir menos líneas de código.