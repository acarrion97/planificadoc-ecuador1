## Purpose

Reordenar el Inicio en torno a las tres intenciones reales del docente — buscar una destreza, continuar un trabajo en curso y crear uno nuevo — eliminando el catálogo de módulos y de áreas que hoy compite con ellas.

## ADDED Requirements

### Requirement: Inicio organizado por intención
El Inicio SHALL presentar, en este orden: identidad de marca (nombre y claim), buscador de código de destreza, bloque **Continuar** y bloque **Crear**.

#### Scenario: Estructura del Inicio
- **WHEN** el usuario abre Inicio
- **THEN** ve la marca, el buscador, el bloque Continuar (cuando haya contenido) y el CTA de creación, sin otras secciones de catálogo

### Requirement: El catálogo de áreas no aparece en el Inicio
El Inicio SHALL **no** mostrar cuadrículas de áreas (EGB/BGU) ni tarjetas de módulos de creación (Inicial, Preparatoria, PCA, PCT, Bachillerato Técnico); el catálogo vive en Explorar y en `/crear`.

#### Scenario: Sin cuadrículas ni tarjetas de módulo
- **WHEN** el usuario desplaza el Inicio en estado sin búsqueda
- **THEN** no encuentra cuadrículas de áreas ni tarjetas de módulos de creación

#### Scenario: El Inicio no duplica Explorar
- **WHEN** se compara el Inicio con la sección Explorar
- **THEN** el listado de áreas y subniveles solo aparece en Explorar

### Requirement: CTA de creación en el Inicio
El Inicio SHALL mostrar un CTA "＋ Nueva planificación" que abre el hub de creación.

#### Scenario: Activación del CTA
- **WHEN** el usuario pulsa "＋ Nueva planificación"
- **THEN** se abre `/crear`

### Requirement: Bloque Continuar con estado vacío
El bloque **Continuar** SHALL mostrar accesos recientes a planes existentes y SHALL ocultarse cuando no hay planes guardados, sin dejar espacios vacíos ni mensajes de error.

#### Scenario: Usuario con planes recientes
- **WHEN** el usuario tiene planificaciones guardadas
- **THEN** ve sus planes más recientes y al seleccionar uno llega a su detalle correspondiente

#### Scenario: Usuario sin planes
- **WHEN** el usuario no tiene ninguna planificación guardada
- **THEN** el bloque Continuar no se renderiza y el Inicio muestra marca, buscador y CTA de creación

### Requirement: El buscador conserva su comportamiento
El buscador de códigos de destreza del Inicio SHALL mantener el comportamiento actual: resultados por código con acceso al detalle de la destreza.

#### Scenario: Búsqueda con resultados
- **WHEN** el usuario escribe un código de destreza válido
- **THEN** ve los resultados y puede abrir el detalle de la destreza

#### Scenario: Búsqueda vacía
- **WHEN** el usuario limpia el campo de búsqueda
- **THEN** vuelve a la vista por intención del Inicio

### Requirement: Banner de la comunidad fuera del Inicio
El banner del grupo de WhatsApp SHALL retirarse del Inicio y estar disponible desde Mi cuenta.

#### Scenario: Comunidad accesible desde Mi cuenta
- **WHEN** el usuario quiere entrar al grupo de WhatsApp
- **THEN** encuentra el enlace en Mi cuenta
