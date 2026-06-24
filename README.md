# Propuesta de Proyecto

# 1. Nombre del proyecto

**DondeEstaMiPolloAPI**

Sistema de monitoreo y consulta de disponibilidad de pollo en puntos de venta fijos y móviles.

---

# 2. Descripción general del proyecto

DondeEstaMiPolloAPI es una API REST diseñada para ayudar a los ciudadanos de La Paz a encontrar puntos de venta de pollo disponibles durante periodos de escasez o alta demanda. Actualmente, muchas personas desconocen dónde existe disponibilidad de pollo, cuáles son los precios vigentes o dónde se encuentran las unidades móviles de distribución de instituciones como EMAPA.

El sistema permitirá registrar y consultar puntos de venta fijos y móviles, mostrando información actualizada sobre stock disponible, precio por kilogramo, ubicación geográfica y fecha de actualización. Además, los usuarios podrán localizar los puntos de venta más cercanos mediante servicios de geolocalización.

La plataforma estará dirigida a consumidores, vendedores y administradores, proporcionando una fuente centralizada de información para mejorar el acceso a productos avícolas y reducir desplazamientos innecesarios.

---

# 3. Objetivo general

Desarrollar una API REST utilizando Node.js, Express.js y MongoDB que permita gestionar puntos de venta de pollo, inventarios, usuarios y ubicaciones, proporcionando información actualizada sobre disponibilidad, precios y localización de puntos de venta fijos y móviles.

---

# 4. Usuarios o roles del sistema

## Administrador

* Gestionar usuarios.
* Aprobar puntos de venta.
* Gestionar reportes.
* Consultar estadísticas del sistema.
* Gestionar inventarios globales.

## Vendedor

* Registrar puntos de venta.
* Actualizar stock disponible.
* Actualizar precios.
* Gestionar ubicaciones de puntos móviles.
* Marcar productos como agotados.

## Consumidor

* Consultar disponibilidad de pollo.
* Buscar puntos de venta cercanos.
* Filtrar resultados por precio.
* Consultar historial de precios.

---

# 5. Historias de usuario

1. Como consumidor, quiero consultar los puntos de venta disponibles para encontrar pollo cerca de mi ubicación.

2. Como consumidor, quiero visualizar el precio por kilogramo para comparar opciones de compra.

3. Como consumidor, quiero conocer la cantidad disponible de pollo para evitar desplazamientos innecesarios.

4. Como consumidor, quiero buscar puntos de venta cercanos a mi ubicación para reducir el tiempo de traslado.

5. Como vendedor, quiero consultar el historial de cambios de precios de mis productos, para analizar la evolución de los precios a lo largo del tiempo.

6. Como vendedor, quiero registrar un nuevo punto de venta para ofrecer información sobre mi disponibilidad.

7. Como vendedor, quiero actualizar el stock disponible para mantener la información actualizada.

8. Como vendedor, quiero actualizar el precio del producto para reflejar cambios en el mercado.

9. Como administrador, quiero aprobar nuevos puntos de venta para garantizar información confiable.

10. Como administrador, quiero visualizar estadísticas de precios y disponibilidad para analizar el comportamiento del mercado.

---

# 6. Funcionalidades principales del proyecto

| Historia de usuario             | Funcionalidad             |
| ------------------------------- | ------------------------- |
| Consultar puntos de venta       | Listar puntos de venta    |
| Visualizar precios              | Consulta de precios       |
| Consultar stock disponible      | Gestión de inventario     |
| Buscar puntos cercanos          | Geolocalización           |
| Registrar punto de venta        | Crear punto de venta      |
| Actualizar stock                | Modificar inventario      |
| Actualizar precio               | Modificar precio          |
| Aprobar puntos de venta         | Moderación administrativa |
| Ver estadísticas                | Módulo de analítica       |

---

# 7. Modelo de datos inicial

## Usuario

* nombre
* correo
* contraseña
* rol
* estado
* fechaCreacion

## PuntoVenta

* nombre
* tipo (FIJO / MOVIL)
* dirección
* latitud
* longitud
* estado
* propietario

## Inventario

* puntoVenta
* cantidadDisponible
* precioPorKg
* estado
* fechaActualizacion

---

# 8. Endpoints tentativos de la API

## Autenticación

| Método | Endpoint           | Descripción       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Registrar usuario |
| POST   | /api/auth/login    | Iniciar sesión    |

## Usuarios

| Método | Endpoint       | Descripción        |
| ------ | -------------- | ------------------ |
| GET    | /api/users     | Listar usuarios    |
| GET    | /api/users/:id | Obtener usuario    |
| PATCH  | /api/users/:id | Actualizar usuario |

## Puntos de Venta

| Método | Endpoint                   | Descripción                          |
| ------ | -------------------------- | ------------------------------------ |
| GET    | /api/sales-points          | Listar puntos de venta               |
| GET    | /api/sales-points/:id      | Obtener punto de venta               |
| GET    | /api/sales-points//near-me | Buscar el punto de venta más cercano |
| POST   | /api/sales-points          | Crear punto de venta                 |
| PUT    | /api/sales-points/:id      | Actualizar punto de venta            |
| DELETE | /api/sales-points/:id      | Eliminar punto de venta              |

## Inventario

| Método | Endpoint                 | Descripción              |
| ------ | ------------------------ | ------------------------ |
| GET    | /api/inventory           | Listar inventarios       |
| GET    | /api/inventory/available | Consultar disponibilidad |
| GET    | /api/inventory/nearby    | Buscar puntos cercanos   |
| POST   | /api/inventory           | Registrar inventario     |
| PATCH  | /api/inventory/:id       | Actualizar inventario    |

## Estadísticas

| Método | Endpoint                     | Descripción                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | /api/statistics/prices       | Estadísticas de precios        |
| GET    | /api/statistics/availability | Estadísticas de disponibilidad |

---

# 9. Reglas de negocio

* No se puede registrar un punto de venta sin nombre y ubicación.
* El precio del pollo no puede ser menor o igual a cero.
* El stock disponible no puede ser negativo.
* Solo los vendedores pueden actualizar inventarios.
* Solo los administradores pueden aprobar puntos de venta.
* No se puede registrar un inventario sin asociarlo a un punto de venta.
* Los puntos de venta móviles deben registrar una ubicación.
* El historial de precios debe almacenarse cada vez que se modifique el precio.

---

# 10. Tecnologías a utilizar

## Backend

* Node.js
* Express.js

## Base de Datos

* MongoDB
* Mongoose

## Seguridad

* JWT (JSON Web Token)
* bcrypt

## Documentación

* Swagger/OpenAPI

## Testing

* Vitest
* Supertest

## APIs Externas

* OpenRouteService API

## Herramientas

* Postman
* GitHub
* GitHub Actions

## Despliegue

* Render
* MongoDB Atlas

---

# 11. Alcance del proyecto

## Incluye

* Registro e inicio de sesión.
* Autenticación mediante JWT.
* Autorización basada en roles.
* CRUD de puntos de venta.
* CRUD de inventarios.
* Consulta de puntos de venta cercanos.
* Historial de precios.
* Estadísticas básicas.
* Integración con APIs externas de geolocalización.
* Documentación Swagger.
* Pruebas unitarias.
* Despliegue público de la API.

## No incluye

* Frontend.
* Pagos en línea.
* Compra directa de productos.
* Notificaciones SMS.
* Integración con sistemas gubernamentales reales.
* Actualización automática de inventarios desde EMAPA.
