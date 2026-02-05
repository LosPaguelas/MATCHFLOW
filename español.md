Crudzaso · – Parte 2

MatchFlow pasa a la Fase 2, enfocándose en la estabilización de código heredado y la monetización. Los equipos reciben código existente de otro equipo sin traspaso de información y deben tratarlo como un sistema legacy real, corrigiendo errores y extendiendo la lógica de negocio.

Objetivos Principales
1. Estabilización del Código Heredado

Los equipos deben analizar el repositorio recibido y corregir:

Errores funcionales y flujos rotos

Funcionalidades incompletas de la Parte 1

Reglas de reservación, bloqueo, matching, Open to Work y contacto

Problemas de integración con json-server

Se permite refactorizar, pero debe documentarse

2. Planes de Suscripción para Candidatos (Dominio de Capacidad de Reservas)

Concepto clave: El plan del candidato controla cuántas empresas pueden reservar al mismo candidato simultáneamente.

Candidato Free

(prioridad de bronce a oro)

Máximo 1 reserva activa

Si está reservado → otras empresas no pueden reservar

Comportamiento de visibilidad = heredado de la Parte 1 (oculto o marcado como reservado)

Candidato Pro – Nivel 1

Máximo 2 reservas simultáneas

El sistema debe bloquear la tercera reserva

Candidato Pro – Nivel 2

Máximo 5 reservas simultáneas

El sistema debe bloquear la sexta reserva

Regla de cumplimiento:

Debe aplicarse en la capa de lógica de negocio (service/controller)

Validaciones solo en UI no son válidas

Planes de Suscripción para Empresas (Dominio de Visibilidad y Filtros)

Concepto clave: El plan de la empresa controla qué candidatos puede ver y cómo filtrarlos.

Empresa Free

Reglas de visibilidad por defecto de MatchFlow

Filtros limitados (solo básicos)

No puede ignorar bloqueos por reserva

Empresa Business

(filtro por idioma)

Mayor visibilidad de candidatos (decisión del grupo)

Filtros avanzados (por ejemplo, habilidades)

Posibles límites mayores de búsqueda/match

Empresa Enterprise

(filtro por experiencia)

Puede ver todos los candidatos, incluso los reservados

Libertad total de filtros (habilidades, atributos, filtros personalizados)

Aún no puede reservar si el candidato alcanzó el límite de reservas

Reglas Globales de Negocio entre Planes (Restricciones del Sistema)

Estas reglas tienen prioridad sobre todos los planes:

Regla de Bloqueo de Reservas
Incluso empresas Enterprise no pueden ignorar los límites de reservas

Regla de Plan Activo Único
Cada candidato y empresa debe tener exactamente un plan activo

Aplicación en Tiempo Real
Actualizar o cambiar de plan modifica el comportamiento del sistema inmediatamente

Capa Técnica de Aplicación (Relación con la Arquitectura)

Dónde debe vivir la lógica (NO en la UI):

Servicio de validación de reservas

Servicio de visibilidad de candidatos

Servicio de filtrado de empresas

Middleware de planes / capa de políticas

Flujo conceptual:

Empresa → Buscar candidatos → Verificación de política de plan → Datos devueltos

Empresa → Reservar candidato → Verificación de política del plan del candidato → Permitir/Bloquear

3. Reglas de Gestión de Planes

Cada usuario/empresa tiene exactamente un plan activo

Los planes deben identificarse claramente

Subir o bajar de plan cambia el comportamiento inmediatamente

Los pagos son simulados

4. Requisitos de Presentación (15 minutos)

Cada integrante debe hablar. Incluir:

Producto/Negocio

Qué es MatchFlow y qué problema resuelve

Modelo de contratación basado en match

Estrategia de monetización

Explicación de planes

Técnico

Visión general del código heredado

Correcciones y mejoras

Lógica de aplicación de planes

Retos y soluciones

Reflexión

Dificultades con código legacy

Mejoras posibles con más tiempo

Lecciones aprendidas

Requisitos de Documentación

El repositorio debe documentar:

Correcciones y refactorizaciones

Reglas de planes y su aplicación

Decisiones arquitectónicas

Cómo ejecutar el proyecto

README actualizado + crudactivity-MatchFlow.md

Reglas de Negocio Clave (de la Parte 1)

Candidatos visibles solo cuando Open to Work = true

Empresas crean matches (los candidatos nunca aplican)

Match vinculado a empresa + oferta laboral + candidato

Estados del match: pending, contacted, interview, hired, discarded

La reserva bloquea a otras empresas

Información de contacto visible solo después del estado contacted

Uso obligatorio de json-server + fetch + caching

Requisitos Técnicos y de Equipo

Git Flow (main, develop, feature/*)

Conventional Commits

Organización de GitHub con TLs como propietarios

README con setup, decisiones y datos del equipo