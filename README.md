# Bon APPetit

![logo](https://github.com/user-attachments/assets/652ff453-48d1-4a07-a8df-ec9b31770730)

Aplicación de recetas de cocina desarrollada como parte de la materia Metodología de sistemas, Universidad Tecnológica Nacional.
Integrantes: Imanol Sayago - Mateo Arcidiacono.

¡Creaciones y mucho sabor!

---

## Introducción

Este documento presenta la documentación de requisitos de software para el desarrollo de una aplicación de recetas de cocina. La aplicación tiene como objetivo principal ofrecer a los usuarios una plataforma intuitiva y accesible, donde podrán buscar recetas, guardar sus favoritas y crear nuevas recetas desde cualquier dispositivo con conexión a internet.

---

## Propósito

Definir detalladamente los requisitos funcionales y no funcionales de la aplicación. Este documento proporciona una descripción completa del sistema propuesto, incluidas sus funciones, características y restricciones, con el fin de guiar el desarrollo, implementación y verificación del sistema.

**Dirigido a:**

- El equipo de desarrollo.
- Los analistas en sistemas.
- Clientes y Usuarios Finales.
- Equipo de Pruebas.

---

## Ámbito y Perspectiva del Sistema

El sistema funcionará de manera independiente, pero integrará el consumo de una API externa para acceder a su catálogo de recetas. Se ha seleccionado la API **YouTube Data API v3** debido a la posibilidad de acceder a un extenso repertorio de recetas y la facilidad que ofrece para realizar búsquedas. Esta API se utilizará para obtener videos de recetas basadas en la búsqueda en lenguaje natural gestionadas por la API **Gemini-2.5-Flash**.

Bon APPetit no incluirá funcionalidades de red social, por lo que las interacciones entre usuarios serán mínimas. Cada usuario podrá agregar comentarios propios a las recetas que tenga guardadas, pero esos comentarios no serán visibles por otros usuarios.

---

## Herramientas Utilizadas

Hasta el momento los lenguajes que se utilizarán para la creación de la aplicación serán:

- Angular
- JavaScript
- HTML
- CSS

---

## Definición de Requisitos del Sistema

### Requisitos Funcionales:

- **RF01:** El sistema debe permitir al usuario realizar altas, bajas y modificaciones (ABM) de su cuenta.
- **RF02:** El sistema debe permitir al usuario mostrar su información personal y ver su perfil.
- **RF03:** El sistema debe permitir al usuario realizar ABM de recetas, es decir, crear nuevas recetas, modificarlas o eliminarlas según sus preferencias.
- **RF04:** El sistema debe permitir al usuario listar recetas.
- **RF05:** El sistema debe permitir al usuario buscar las recetas en base a preferencias alimentarias específicas, como dietas veganas, vegetarianas, sin gluten, alimentos específicos, entre otras.
- **RF06:** El sistema debe permitir al usuario crear listas personalizadas con diferentes preferencias, como recetas u otras categorías creadas por el usuario.
- **RF07:** El sistema debe permitir al usuario cargar una foto propia a su perfil personal.
- **RF08:** El sistema debe permitir al usuario agregar comentarios o anotaciones personales a las recetas que haya guardado en su lista.
- **RF09:** El sistema debe permitir al usuario ver los comentarios y anotaciones que ha agregado a sus recetas guardadas.
- **RF10:** El sistema debe permitir visualizar los videos de las recetas en la propia página.
- **RF11:** El sistema debe permitir al usuario ver otras recetas recomendadas al finalizar la receta seleccionada.
- **RF12:** El sistema debe permitir al usuario realizar búsquedas en base a ingredientes, nombres de recetas, tipos de dietas.
- **RF13:** El sistema debe permitir al usuario realizar búsquedas en base a lenguaje natural a modo de “prompt” de inteligencia artificial.

### Requisitos No Funcionales:

- **1. Rendimiento:** El sistema debe ser capaz de procesar consultas de búsqueda de recetas en menos de 5 segundos. Debe soportar hasta 1000 usuarios concurrentes sin degradación significativa en el rendimiento.
- **2. Escalabilidad:** El sistema debe ser escalable para soportar un aumento en la base de datos de hasta 1 millón de recetas sin afectar el tiempo de respuesta.
- **3. Usabilidad:** La interfaz de usuario debe ser intuitiva y accesible, permitiendo que un usuario sin experiencia técnica pueda realizar las operaciones básicas en menos de 3 minutos.
- **4. Compatibilidad:** La aplicación debe ser compatible con los navegadores más usados (Chrome, Firefox, Edge, Safari) en sus últimas 3 versiones.
- **5. Mantenimiento y Extensibilidad:** El sistema debe estar diseñado con una arquitectura modular para facilitar la integración de nuevas funcionalidades sin afectar las existentes.
- **6. Persistencia:** El sistema debe utilizar un sistema de persistencia de datos para guardar los datos, usuarios, recetas, listas, etc.

---

## Mapa de Impacto

**Objetivo Central:**
Facilitar que los usuarios encuentren y organicen recetas basadas en los alimentos que tienen disponibles, fomentando la creatividad y el aprovechamiento de ingredientes.

**Actor Principal:**
Usuario registrado.

**Impactos Esperados:**

1. Puede ingresar los alimentos que tiene y obtener recetas sugeridas.
2. Puede crear y guardar sus propias recetas.
3. Puede realizar búsquedas en lenguaje natural.
4. Puede crear listas personalizadas de recetas (por ejemplo, "favoritas", "para el finde", etc.).
5. Puede explorar recetas basadas en sus gustos.

---

## Instalación y Ejecución

**Backend**

1. Clona el repositorio del backend: `git clone https://github.com/matearg/BonAppetit-back.git`.
2. Ingresa al directorio: `cd BonAppetit-back`.
3. Instala dependencias: `npm install`.
4. Ejecuta el servidor: `node server.js`.
5. Sal del directorio: `cd ..`.

**Frontend**

1. Clona el repositorio: `git clone https://github.com/matearg/BonAppetit.git`.
2. Ingresa al directorio: `cd BonAppetit`.
3. Instala dependencias: `npm install`.
4. Instala dependencias externas: `npm install sweetalert2`.
5. Ejecuta base de datos: `json-server database/database.json`.
6. Ejecuta el servidor de desarrollo: `ng serve`.
7. Accede a la aplicación en `http://localhost:4200`.
