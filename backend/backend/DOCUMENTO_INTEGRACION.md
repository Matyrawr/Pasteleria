# DOCUMENTO DE INTEGRACIÓN — Pastelería Backend + Frontend

**Versión**: 1.0  
**Fecha**: 27 de noviembre de 2024  
**Asignatura**: DSY1104 - Desarrollo Fullstack II  

---

## TABLA DE CONTENIDOS
1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Arquitectura General](#arquitectura-general)
4. [Autenticación y Seguridad](#autenticación-y-seguridad)
5. [Endpoints REST](#endpoints-rest)
6. [Flujos Principales](#flujos-principales)
7. [Ejemplos de Uso (cURL/Postman)](#ejemplos-de-uso)
8. [Códigos de Error](#códigos-de-error)
9. [Notas de Seguridad](#notas-de-seguridad)

---

## INTRODUCCIÓN

Este documento describe cómo el **frontend se comunica con el backend** en la aplicación de e-commerce de Pastelería. La comunicación se realiza mediante una **API REST** utilizando **HTTP** y **JSON**, con autenticación basada en **JWT (JSON Web Tokens)**.

### Objetivo
Proporcionar a los desarrolladores frontend una guía clara para:
- Entender la estructura y endpoints disponibles.
- Implementar autenticación y autorización.
- Manejar errores y respuestas.
- Probar endpoints con herramientas como Postman o cURL.

---

## REQUISITOS PREVIOS

### Backend
- **Framework**: Spring Boot 3.5.8
- **Base de Datos**: H2 (desarrollo) o MySQL (producción)
- **Puerto**: `8080` (por defecto)
- **URL base**: `http://localhost:8080`

### Frontend
- **Framework**: React, Angular, Vue.js o similar
- **Biblioteca de HTTP**: Axios, Fetch API, etc.
- **Almacenamiento**: localStorage/sessionStorage para tokens JWT

### Herramientas de Prueba
- **Postman**: https://www.postman.com/
- **cURL**: Incluido en Windows 10+ PowerShell y macOS/Linux
- **Thunder Client** (VS Code extension)

---

## ARQUITECTURA GENERAL

```
┌─────────────────┐                    ┌──────────────────┐
│   Frontend      │                    │    Backend       │
│  (HTML/CSS/JS)  │                    │  (Spring Boot)   │
│                 │                    │                  │
│ • Views/Pages   │    HTTP(S) REST    │ • Controllers    │
│ • State Manager │ <──────────────>   │ • Services       │
│ • HTTP Client   │      (JSON)        │ • Repositories   │
└─────────────────┘                    └──────────────────┘
         │                                      │
         │                                      ▼
         │                              ┌──────────────────┐
         │                              │   Database       │
         │                              │  (H2 / MySQL)    │
         └──────────────────────────────┼──────────────────┘
                                        │
                            (JPA/Hibernate)
```

### Flujo Típico de una Solicitud
1. **Frontend** realiza una solicitud HTTP (GET, POST, PUT, DELETE) a un endpoint del backend.
2. **Backend** recibe la solicitud, valida el token JWT (si es requerido), procesa la lógica.
3. **Backend** responde con JSON (datos o error).
4. **Frontend** procesa la respuesta y actualiza la interfaz.

---

## AUTENTICACIÓN Y SEGURIDAD

### JWT (JSON Web Token)

Un JWT es un token codificado que contiene información del usuario. Consta de 3 partes separadas por `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VybmFtZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAwMzYwMH0.SIGNATURE
│────────────────────────────────────│ │──────────────────────────────────────────────────────│ │──────────────┤
        Header (algoritmo)                       Payload (datos del usuario)                     Firma (HMAC)
```

### Flujo de Autenticación

1. **Registro**: Usuario envía username y password → Backend genera token → Frontend almacena token.
2. **Login**: Usuario envía username y password → Backend genera token → Frontend almacena token.
3. **Solicitudes autenticadas**: Frontend envía token en header `Authorization: Bearer <token>` → Backend valida token.
4. **Refresh**: Token expira → Frontend solicita nuevo token con refresh token → Backend genera nuevo access token.
5. **Logout**: Frontend elimina token de almacenamiento local.

### Expiración de Tokens

- **Access Token**: 24 horas (configurable en `application.properties`: `jwt.expirationMs=86400000`).
- **Refresh Token** (implementación futura): 7 días.

### Almacenamiento Seguro del Token (Frontend)

```javascript
// ❌ INSEGURO: localStorage es vulnerable a XSS
localStorage.setItem('token', token);

// ✅ SEGURO: Cookie HttpOnly (no accesible desde JavaScript)
// Solicitar al backend que devuelva token en cookie HttpOnly

// ✅ ALTERNATIVA: sessionStorage (se elimina al cerrar navegador)
sessionStorage.setItem('token', token);
```

---

## ENDPOINTS REST

### 1. Autenticación

#### 1.1 Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "SecurePassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "newuser"
}
```

**Errores**:
- `400 Bad Request`: Datos incompletos o inválidos.
- `409 Conflict`: Usuario ya existe.

---

#### 1.2 Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "existinguser",
  "password": "SecurePassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "existinguser"
}
```

**Errores**:
- `401 Unauthorized`: Credenciales inválidas.

---

#### 1.3 Obtener Datos del Usuario Autenticado (PRÓXIMAMENTE)
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "username": "existinguser",
  "roles": ["ROLE_USER"]
}
```

**Errores**:
- `401 Unauthorized`: Token ausente o inválido.

---

#### 1.4 Renovar Token (PRÓXIMAMENTE)
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores**:
- `401 Unauthorized`: Refresh token expirado o inválido.

---

### 2. Productos

#### 2.1 Listar Productos
```http
GET /api/productos
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "nombre": "Tarta de Chocolate",
    "descripcion": "Deliciosa tarta de chocolate belga",
    "precio": 25.50,
    "stock": 10
  },
  {
    "id": 2,
    "nombre": "Pastel de Vainilla",
    "descripcion": "Pastel de vainilla casero",
    "precio": 15.00,
    "stock": 20
  }
]
```

---

#### 2.2 Obtener Producto por ID
```http
GET /api/productos/1
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "nombre": "Tarta de Chocolate",
  "descripcion": "Deliciosa tarta de chocolate belga",
  "precio": 25.50,
  "stock": 10
}
```

**Errores**:
- `404 Not Found`: Producto no existe.

---

#### 2.3 Crear Producto (ADMIN)
```http
POST /api/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo Postre",
  "descripcion": "Descripción",
  "precio": 20.00,
  "stock": 5
}
```

**Response (201 Created)**:
```json
{
  "id": 3,
  "nombre": "Nuevo Postre",
  "descripcion": "Descripción",
  "precio": 20.00,
  "stock": 5
}
```

**Errores**:
- `401 Unauthorized`: Token ausente.
- `403 Forbidden`: Usuario no tiene rol ADMIN.

---

#### 2.4 Actualizar Producto (ADMIN)
```http
PUT /api/productos/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Tarta de Chocolate Premium",
  "descripcion": "Versión mejorada",
  "precio": 30.00,
  "stock": 15
}
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "nombre": "Tarta de Chocolate Premium",
  "descripcion": "Versión mejorada",
  "precio": 30.00,
  "stock": 15
}
```

---

#### 2.5 Eliminar Producto (ADMIN)
```http
DELETE /api/productos/1
Authorization: Bearer <token>
```

**Response (204 No Content)**:
(Sin cuerpo)

**Errores**:
- `404 Not Found`: Producto no existe.
- `403 Forbidden`: Usuario no tiene rol ADMIN.

---

### 3. Pedidos (PRÓXIMAMENTE)

#### 3.1 Crear Pedido
```http
POST /api/pedidos
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    },
    {
      "productoId": 2,
      "cantidad": 1
    }
  ],
  "direccion": "Calle Principal 123, Apartamento 4B"
}
```

**Response (201 Created)**:
```json
{
  "id": 1,
  "usuarioId": 5,
  "estado": "CREATED",
  "total": 66.00,
  "fechaCreacion": "2024-11-27T10:30:00Z",
  "items": [
    {
      "id": 1,
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 25.50
    },
    {
      "id": 2,
      "productoId": 2,
      "cantidad": 1,
      "precioUnitario": 15.00
    }
  ]
}
```

---

#### 3.2 Listar Pedidos del Usuario
```http
GET /api/pedidos
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "usuarioId": 5,
    "estado": "CONFIRMED",
    "total": 66.00,
    "fechaCreacion": "2024-11-27T10:30:00Z"
  }
]
```

---

#### 3.3 Obtener Pedido por ID
```http
GET /api/pedidos/1
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "usuarioId": 5,
  "estado": "CONFIRMED",
  "total": 66.00,
  "fechaCreacion": "2024-11-27T10:30:00Z",
  "items": [...]
}
```

---

### 4. Pagos (PRÓXIMAMENTE)

#### 4.1 Iniciar Pago
```http
POST /api/payments/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "pedidoId": 1,
  "amount": 66.00,
  "currency": "USD"
}
```

**Response (201 Created)**:
```json
{
  "id": 1,
  "txId": "txn_abc123xyz",
  "pedidoId": 1,
  "amount": 66.00,
  "estado": "CREATED",
  "fechaCreacion": "2024-11-27T10:35:00Z"
}
```

---

#### 4.2 Confirmar Pago (Commit)
```http
POST /api/payments/commit/txn_abc123xyz
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "txId": "txn_abc123xyz",
  "estado": "COMMITTED",
  "pedidoId": 1,
  "message": "Pago confirmado. Pedido actualizado a CONFIRMED."
}
```

**Errores**:
- `404 Not Found`: Pago no existe.
- `409 Conflict`: Stock insuficiente al confirmar pedido.
- `400 Bad Request`: Pago ya fue confirmado.

---

#### 4.3 Obtener Estado del Pago
```http
GET /api/payments/status/txn_abc123xyz
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "txId": "txn_abc123xyz",
  "estado": "COMMITTED",
  "pedidoId": 1,
  "amount": 66.00
}
```

---

#### 4.4 Webhook de Pago (Notificación del Proveedor)
```http
POST /api/payments/webhook
Content-Type: application/json

{
  "txId": "txn_abc123xyz",
  "estado": "COMPLETED",
  "timestamp": "2024-11-27T10:35:00Z"
}
```

**Response (200 OK)**:
```json
{
  "message": "Webhook procesado"
}
```

---

## FLUJOS PRINCIPALES

### Flujo 1: Registro e Inicio de Sesión

```mermaid
graph LR
A["🌐 Usuario ingresa credenciales"] -->|POST /api/auth/register| B["🔐 Backend valida y crea usuario"]
B -->|Respuesta: token + username| C["💾 Frontend almacena token"]
C -->|Usa token en futuras solicitudes| D["✅ Usuario autenticado"]
```

**Pasos**:
1. Usuario completa formulario de registro (username + password).
2. Frontend realiza `POST /api/auth/register` con credenciales.
3. Backend valida que el usuario no exista, encripta contraseña, crea registro.
4. Backend genera JWT y lo devuelve.
5. Frontend almacena token en `localStorage` o `sessionStorage`.
6. Frontend redirige a dashboard o página principal.

### Flujo 2: Crear Pedido

```mermaid
graph LR
A["📦 Usuario selecciona productos"] -->|Agrega al carrito| B["🛒 Carrito local (Frontend)"]
B -->|POST /api/pedidos| C["🔍 Backend valida y crea pedido"]
C -->|Respuesta: pedidoId| D["💳 Preparar pago"]
```

**Pasos**:
1. Usuario navega por productos (GET `/api/productos`).
2. Usuario agrega productos al carrito (en frontend, no requiere backend aún).
3. Usuario hace clic en "Comprar" → Frontend llama `POST /api/pedidos` con items.
4. Backend crea Pedido y DetallePedido, devuelve `pedidoId`.
5. Frontend almacena `pedidoId` para siguiente paso (pago).

### Flujo 3: Procesar Pago (Create → Commit)

```mermaid
graph LR
A["💳 Usuario inicia pago"] -->|POST /api/payments/create| B["🏦 Backend crea transacción"]
B -->|Respuesta: txId| C["📝 Frontend muestra resumen"]
C -->|Usuario confirma| D["POST /api/payments/commit/{txId}"]
D -->|Valida stock, confirma pedido| E["✅ Pago completado"]
E -->|Email confirmación| F["📧 Usuario"]
```

**Pasos**:
1. Usuario en página de pago → Frontend llama `POST /api/payments/create` con `pedidoId` y `amount`.
2. Backend crea registro Payment con estado `CREATED`, devuelve `txId`.
3. Frontend muestra resumen del pago.
4. Usuario confirma → Frontend llama `POST /api/payments/commit/{txId}`.
5. Backend:
   - Valida que stock está disponible para todos los items del pedido.
   - Si OK: marca Pedido como `CONFIRMED`, decrementa stock, marca Payment como `COMMITTED`.
   - Si falta stock: lanza `InsufficientStockException`, retorna `409 Conflict`, Pedido se revierte (rollback).
6. Frontend recibe respuesta y muestra confirmación o error.

### Flujo 4: Gestión de Sesiones (Frontend)

```mermaid
graph LR
A["🔑 Token almacenado en localStorage"] -->|App.js (useEffect)| B["✔️ Verificar token válido"]
B -->|GET /api/auth/me| C{"¿Token válido?"}
C -->|Sí| D["✅ Cargar dashboard"]
C -->|No (401)| E["🚪 Redirigir a login"]
```

**Pasos**:
1. Al cargar la app, frontend verifica si hay token en `localStorage`.
2. Si existe, llama `GET /api/auth/me` para validar que sigue siendo válido.
3. Si respuesta es `200 OK`, frontend carga el dashboard.
4. Si respuesta es `401 Unauthorized`, frontend redirige a login.
5. Si token está cerca de expirar (ej: <5 min), frontend llama `POST /api/auth/refresh` para renovar.

---

## EJEMPLOS DE USO

### Usando cURL (PowerShell / Linux / macOS)

#### Ejemplo 1: Registrar Usuario
```powershell
$body = @{
    username = "usuario1"
    password = "Password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

#### Ejemplo 2: Login
```powershell
$body = @{
    username = "usuario1"
    password = "Password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

#### Ejemplo 3: Listar Productos (con autenticación)
```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Invoke-WebRequest -Uri "http://localhost:8080/api/productos" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

### Usando Postman

1. **Abrir Postman** → New Collection → "Pastelería Backend".
2. **Request 1: Register**
   - Method: `POST`
   - URL: `http://localhost:8080/api/auth/register`
   - Body (JSON):
     ```json
     {
       "username": "usuario1",
       "password": "Password123"
     }
     ```
   - Click "Send" → Copiar `token` de la respuesta.

3. **Request 2: Login**
   - Method: `POST`
   - URL: `http://localhost:8080/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "usuario1",
       "password": "Password123"
     }
     ```
   - Click "Send" → Copiar `token`.

4. **Request 3: Listar Productos**
   - Method: `GET`
   - URL: `http://localhost:8080/api/productos`
   - Headers: `Authorization: Bearer <token>`
   - Click "Send".

---

## CÓDIGOS DE ERROR

| Código | Descripción | Ejemplo |
|--------|---|---|
| `200 OK` | Solicitud exitosa. | GET `/api/productos` |
| `201 Created` | Recurso creado exitosamente. | POST `/api/productos` (admin) |
| `204 No Content` | Solicitud exitosa, sin contenido. | DELETE `/api/productos/1` |
| `400 Bad Request` | Datos inválidos o incompletos. | `{ "username": "" }` |
| `401 Unauthorized` | Token ausente o inválido. | Header sin `Authorization` |
| `403 Forbidden` | Usuario sin permisos requeridos. | Usuario USER intenta crear producto |
| `404 Not Found` | Recurso no encontrado. | GET `/api/productos/999` |
| `409 Conflict` | Stock insuficiente al confirmar pago. | POST `/api/payments/commit` con stock < cantidad |
| `500 Internal Server Error` | Error en el servidor. | Excepción no manejada |

---

## NOTAS DE SEGURIDAD

### ✅ Buenas Prácticas Implementadas

1. **Contraseñas encriptadas**: BCryptPasswordEncoder (no se almacenan en plano).
2. **JWT firmado**: HMAC-SHA256 con secreto base64 (256 bits).
3. **CORS limitado** (frontend): Configurado para permitir solo orígenes autorizados (actualmente `*`, cambiar en producción).
4. **Sessions sin estado**: `STATELESS` → backend no mantiene sesión HTTP.
5. **Validación de entrada**: username único, tipo de dato validado.

### ⚠️ Mejoras Recomendadas (Para Producción)

1. **HTTPS**: Usar SSL/TLS en producción.
2. **Refresh tokens**: Implementar con expiración larga (7 días) + almacenar en DB.
3. **Token revocation**: Agregar lista negra de tokens revocados.
4. **Rate limiting**: Limitar intentos de login fallidos.
5. **CORS específico**: Cambiar `@CrossOrigin("*")` a `@CrossOrigin("https://dominio-frontend.com")`.
6. **Secreto JWT**: Usar variable de entorno en producción (no en código).
7. **Auditoría**: Registrar intentos de acceso no autorizados.

---

## REFERENCIAS

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io) — Decodificar y entender JWTs.
- [Postman Docs](https://learning.postman.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Documento de Integración v1.0 — DSY1104 Desarrollo Fullstack II**

