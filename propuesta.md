# Guía para la presentación de propuesta de proyecto

## 1. Nombre del proyecto

El equipo debe definir un nombre claro para su sistema.

**Ejemplo:**
Sistema de gestión de productos para un almacén.

---

## 2. Descripción general del proyecto

Explicar brevemente qué problema resuelve el sistema y para quién está dirigido.

**Preguntas guía:**

* ¿Qué problema intenta resolver?
* ¿Quiénes usarán el sistema?
* ¿Por qué sería útil este proyecto?
* ¿Qué tipo de información manejará?

**Ejemplo:**
El proyecto consiste en una API REST para gestionar productos, categorías, usuarios y pedidos de un almacén. El sistema permitirá registrar productos, controlar stock y consultar información de ventas.

---

## 3. Objetivo general

Describir qué se quiere lograr con el proyecto.

**Ejemplo:**
Desarrollar una API REST utilizando Node.js, Express.js y MongoDB que permita administrar los productos, usuarios y pedidos de un almacén.

---

## 4. Usuarios o roles del sistema

Identificar quiénes interactuarán con el sistema.

**Ejemplos de roles:**

* Administrador
* Cliente
* Vendedor
* Encargado de almacén
* Usuario invitado

Cada rol debe tener funcionalidades específicas.

---

## 5. Historias de usuario

El equipo debe presentar al menos **10 historias de usuario** que representen las funcionalidades principales del sistema.

Formato sugerido:

> Como [tipo de usuario], quiero [acción o funcionalidad], para [beneficio o propósito].

**Ejemplos:**

1. Como administrador, quiero registrar nuevos productos, para mantener actualizado el inventario.
2. Como administrador, quiero editar la información de un producto, para corregir datos o actualizar precios.
3. Como administrador, quiero eliminar productos, para retirar productos que ya no se venden.
4. Como cliente, quiero ver la lista de productos disponibles, para elegir qué comprar.
5. Como cliente, quiero buscar productos por nombre, para encontrar rápidamente lo que necesito.
6. Como cliente, quiero agregar productos a un carrito, para preparar una compra.
7. Como cliente, quiero realizar un pedido, para comprar los productos seleccionados.
8. Como administrador, quiero ver todos los pedidos realizados, para gestionar las ventas.
9. Como usuario, quiero iniciar sesión, para acceder a funciones protegidas.
10. Como administrador, quiero ver el stock disponible, para saber qué productos necesitan reposición.

---

## 6. Funcionalidades principales del proyecto

Después de escribir las historias de usuario, el equipo debe convertirlas en funcionalidades concretas del sistema.

**Ejemplo:**

| Historia de usuario                            | Funcionalidad    |
| ---------------------------------------------- | ---------------- |
| Como administrador, quiero registrar productos | Crear producto   |
| Como cliente, quiero ver productos disponibles | Listar productos |
| Como usuario, quiero iniciar sesión            | Login de usuario |

---

## 7. Modelo de datos inicial

El equipo debe identificar las entidades principales que tendrá su base de datos.

**Ejemplo para un sistema de almacén:**

### Producto

* nombre
* descripción
* precio
* stock
* categoría
* imagen
* estado

### Usuario

* nombre
* correo
* contraseña
* rol

### Pedido

* usuario
* productos
* total
* estado
* fecha

---

## 8. Endpoints tentativos de la API

El equipo debe proponer algunos endpoints iniciales.

**Ejemplo:**

| Método | Endpoint               | Descripción               |
| ------ | ---------------------- | ------------------------- |
| GET    | /api/products          | Listar productos          |
| GET    | /api/products/:id      | Obtener un producto       |
| POST   | /api/products          | Crear producto            |
| PUT    | /api/products/:id      | Actualizar producto       |
| DELETE | /api/products/:id      | Eliminar producto         |
| POST   | /api/auth/register     | Registrar usuario         |
| POST   | /api/auth/login        | Iniciar sesión            |
| POST   | /api/orders            | Crear pedido              |
| GET    | /api/orders            | Listar pedidos            |
| PATCH  | /api/orders/:id/status | Cambiar estado del pedido |

---

## 9. Reglas de negocio

El equipo debe definir condiciones importantes del sistema.

**Ejemplos:**

* No se puede crear un producto sin nombre, precio y stock.
* El precio de un producto no puede ser negativo.
* El stock no puede ser menor a cero.
* Solo un administrador puede crear, editar o eliminar productos.
* Un usuario debe iniciar sesión para realizar un pedido.
* No se puede hacer un pedido si no hay stock suficiente.

---

## 10. Tecnologías a utilizar

El equipo debe indicar las tecnologías que usará.

**Ejemplo:**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT para autenticación
* Postman para pruebas
* GitHub para control de versiones
* Swagger/OpenAPI para documentación, si corresponde

---

## 11. Alcance del proyecto

El equipo debe aclarar qué incluirá y qué no incluirá su proyecto.

### Incluye:

* CRUD de productos
* Registro e inicio de sesión
* Gestión de pedidos
* Validación de datos
* Conexión con MongoDB

### No incluye:

* Pasarela de pagos real
* Aplicación móvil
* Panel visual avanzado
* Envío real de correos electrónicos

---