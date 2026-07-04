# Plan de Implementación

## Contexto

El objetivo es implementar los endpoints **SHOW** y **DELETE** dentro de una API REST desarrollada con NestJS.

La implementación debe integrarse completamente con la arquitectura existente del proyecto, evitando cambios innecesarios y respetando todas las convenciones ya utilizadas.

Este documento describe el procedimiento que debe seguir el agente antes, durante y después de la implementación.

---

# Objetivo

Agregar soporte para:

- GET /:id
- DELETE /:id

manteniendo una arquitectura limpia, consistente y fácilmente mantenible.

---

# Principios obligatorios

Durante toda la implementación deben respetarse los siguientes principios:

- SOLID
- Clean Architecture
- Clean Code
- Separation of Concerns
- DRY
- KISS
- Dependency Injection
- Single Responsibility Principle
- Open/Closed Principle

No deben sacrificarse estos principios para escribir menos código.

---

# Restricciones

El agente NO debe:

- modificar módulos no relacionados
- cambiar la arquitectura existente
- refactorizar componentes fuera del alcance
- renombrar clases sin necesidad
- modificar rutas existentes
- introducir dependencias nuevas
- duplicar lógica
- agregar utilidades genéricas innecesarias
- cambiar el estilo de código del proyecto

Todo cambio debe estar directamente relacionado con SHOW o DELETE.

---

# Fase 1 — Análisis

Antes de escribir código el agente debe analizar:

## Controller

Identificar:

- endpoints existentes
- convenciones de rutas
- uso de DTOs
- Pipes
- Guards
- Swagger
- Decoradores

## Service

Identificar:

- responsabilidades
- métodos existentes reutilizables
- lógica repetible
- validaciones existentes

## Repository

Analizar:

- ORM utilizado
- métodos disponibles
- manejo de errores
- consultas existentes

## DTOs

Verificar si:

- existe DTO para parámetros
- existe DTO reutilizable
- es necesario crear uno nuevo

No crear DTOs innecesarios.

---

# Fase 2 — Diseño

Antes de implementar definir:

## SHOW

Determinar:

- flujo completo
- validaciones
- excepciones
- respuesta

## DELETE

Determinar:

- existencia previa
- estrategia de eliminación
- respuesta HTTP
- manejo de errores

No comenzar la implementación hasta tener definido el flujo completo.

---

# Fase 3 — Implementación Controller

Agregar únicamente:

GET /:id

DELETE /:id

El Controller únicamente debe:

- recibir request
- validar parámetros mediante Pipes
- invocar el Service
- retornar respuesta

No agregar lógica de negocio.

---

# Fase 4 — Implementación Service

Toda la lógica debe vivir aquí.

Implementar:

SHOW

Debe:

- buscar entidad
- validar existencia
- lanzar NotFoundException cuando corresponda
- retornar entidad

DELETE

Debe:

- buscar entidad
- validar existencia
- eliminar
- retornar respuesta adecuada

Reutilizar métodos privados cuando sea posible.

No duplicar lógica.

---

# Fase 5 — Persistencia

Usar únicamente el Repository existente.

No escribir consultas duplicadas.

Si existe método reutilizable debe utilizarse.

Si existe Soft Delete utilizarlo.

Solo implementar Hard Delete cuando el proyecto ya utilice ese enfoque.

---

# Fase 6 — Manejo de errores

Utilizar únicamente excepciones nativas de NestJS.

Ejemplos:

- NotFoundException
- BadRequestException
- ConflictException

No devolver objetos manuales de error.

---

# Fase 7 — Swagger

Si Swagger ya existe en el proyecto:

documentar:

- GET
- DELETE

Agregar:

- ApiOperation
- ApiResponse
- ApiParam

Mantener consistencia con el resto del módulo.

---

# Fase 8 — Validaciones

Verificar:

- id válido
- entidad existente
- respuestas HTTP
- tipado
- imports
- inyección de dependencias

---

# Fase 9 — Revisión de calidad

Antes de finalizar revisar:

□ No existe código duplicado

□ No existe lógica en Controller

□ No existen métodos muertos

□ No existen imports sin usar

□ No existen variables innecesarias

□ Los nombres son consistentes

□ Se respetó SOLID

□ Se respetó Clean Code

□ Se respetó la arquitectura existente

---

# Entrega

La respuesta final debe contener:

1. Resumen del análisis realizado.

2. Lista de archivos modificados.

3. Justificación de cada cambio.

4. Código completo de cada archivo modificado.

5. Explicación breve de las decisiones de diseño.

No generar código fuera del alcance de esta implementación.

No asumir comportamiento inexistente.

No crear funcionalidades adicionales.

La prioridad absoluta es mantener la consistencia con la arquitectura existente del proyecto.