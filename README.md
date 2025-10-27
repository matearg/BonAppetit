# Bon APPetit

<img src="public/img/logo.jpeg></img>

Aplicación de recetas de cocina desarrollada como parte de la Metodología de Sistemas de la Universidad Tecnológica Nacional.

¡Creaciones y mucho sabor!

---

## Introducción

Este proyecto presenta la documentación de requisitos de software para el desarrollo de una aplicación de recetas de cocina. La aplicación tiene como objetivo ofrecer a los usuarios una plataforma intuitiva y accesible, donde podrán buscar recetas, guardar sus favoritas y crear nuevas recetas desde cualquier dispositivo con conexión a internet.

---

## Propósito

Definir detalladamente los requisitos funcionales y no funcionales de la aplicación. Este documento proporciona una descripción completa del sistema propuesto, incluyendo sus funciones, características y restricciones, con el fin de guiar el desarrollo, implementación y verificación del sistema.

Dirigido a:

- El equipo de desarrollo.
- Los analistas en sistemas.
- Clientes y Usuarios Finales.
- Equipo de Pruebas.

---

## Objetivos del Sistema

La aplicación Bon APPetit tiene como objetivo ofrecer una plataforma accesible para que los usuarios encuentren y organicen recetas basadas en los alimentos que tienen disponibles, fomentando la creatividad y el aprovechamiento de ingredientes. Entre sus metas se incluyen:

- Buscar y filtrar recetas por nombre, ingredientes, tipos de comidas, preferencias de dieta, etc.
- Permitir calificar recetas para clasificarlas por popularidad o recomendaciones.
- Guardar recetas en perfiles personales con notas privadas para personalización.

---

## Herramientas Utilizadas

Hasta el momento, los lenguajes que se utilizarán para la creación de la aplicación son:

- Angular
- JavaScript
- HTML
- CSS

---

## Definición de Requisitos del Sistema

### Requisitos Funcionales:

- **RF01**: El sistema debe permitir al usuario realizar altas, bajas y modificaciones (ABM) de su cuenta.
- **RF02**: El sistema debe permitir al usuario mostrar su información personal y ver su perfil.
- **RF03**: El sistema debe permitir al usuario realizar ABM de recetas (crear, modificar o eliminar según preferencias).
- **RF04**: El sistema debe permitir al usuario listar recetas.
- **RF05**: El sistema debe permitir al usuario filtrar recetas basadas en preferencias alimentarias (veganas, vegetarianas, sin gluten, etc.).
- **RF06**: El sistema debe permitir al usuario crear listas personalizadas con diferentes preferencias o categorías.
- **RF07**: El sistema debe permitir al usuario cargar una foto propia para acompañar su receta.
- **RF08**: El sistema debe permitir al usuario agregar comentarios o anotaciones personales a las recetas guardadas.
- **RF09**: El sistema debe permitir al usuario ver los comentarios y anotaciones que ha agregado a sus recetas guardadas.

### Requisitos No Funcionales:

- **1. Rendimiento**:
  - El sistema debe procesar consultas de búsqueda de recetas en menos de 5 segundos.
  - El sistema debe soportar hasta 1000 usuarios concurrentes sin degradación significativa.
- **2. Escalabilidad**:
  - El sistema debe ser escalable para soportar un aumento en la base de datos hasta 1 millón de recetas sin afectar el tiempo de respuesta.
- **3. Usabilidad**:
  - La interfaz de usuario debe ser intuitiva y accesible, permitiendo que un usuario sin experiencia técnica realice operaciones básicas en menos de 3 minutos.
- **4. Compatibilidad**:
  - La aplicación debe ser compatible con los navegadores más usados (Chrome, Firefox, Edge, Safari) en sus últimas 3 versiones.
- **5. Mantenimiento y Extensibilidad**:
  - El sistema debe estar diseñado con una arquitectura modular para facilitar la integración de nuevas funcionalidades.
- **6. Persistencia**:
  - El sistema debe utilizar un sistema de persistencia de datos para guardar usuarios, recetas, listas, etc.

---

## Mapa de Impacto

### Propósito

El Impact Mapping alinea las funcionalidades del sistema con el objetivo de negocio principal, asegurando que cada entregable se enfoque en generar un cambio de comportamiento en el usuario registrado.

### Objetivo Central

Facilitar que los usuarios encuentren y organicen recetas basadas en los alimentos que tienen disponibles, fomentando la creatividad y el aprovechamiento de ingredientes.

### Actor Principal

- Usuario registrado.

### Impactos

1. Puede ingresar los alimentos que tiene y obtener recetas sugeridas.
2. Puede crear y guardar sus propias recetas.
3. Puede dar "like" a recetas de la API.
4. Puede crear listas personalizadas de recetas.
5. Puede explorar recetas basadas en su historial o gustos.

---

## Modelo Conceptual

(El modelo conceptual incluye un diagrama UML con entidades como Usuario, Receta, Lista de Recetas, Ingrediente, Categoría Receta, y Categoría Ingrediente, con relaciones como "Tiene", "Contiene", y "Distinguido por".)

---

## Instalación y Ejecución

1. Clona el repositorio: `git clone <https://github.com/matearg/BonAppetit.git>`.
2. Instala dependencias: `npm install`.
3. Ejecuta el servidor de desarrollo: `ng serve`.
4. Accede a la aplicación en `http://localhost:4200`.

---

## Contribuciones

Este proyecto es parte de un trabajo académico. Contribuciones son bienvenidas siguiendo las pautas de la documentación.

## Licencia

No se especifica una licencia en la documentación. Se recomienda agregar una (ej. MIT) para uso abierto.
