# INFORME DE EVALUACIÓN — Evaluación Parcial N°3 DSY1104
## Desarrollo Fullstack II: Integración Backend y Frontend a la Tienda Online

**Fecha de informe**: 27 de noviembre de 2024  
**Proyecto**: Backend Pastelería (Spring Boot) + Frontend (pendiente de validación en presentación)  
**Evaluación**: Rúbrica Evaluación Parcial N°3 (40% encargo + 60% presentación)

---

## RESUMEN EJECUTIVO

El backend ha avanzado significativamente en la implementación de funcionalidades core. Se han verificado:
✅ Conexión a base de datos (H2) con modelo de datos funcional (Usuario, Producto, Rol).
✅ API REST con endpoints CRUD y documentación Swagger/OpenAPI.
✅ Autenticación JWT con generación de tokens y gestión de roles (USER/ADMIN).
✅ Configuración de seguridad con permisos granulares basados en roles.
✅ Tests de integración para autenticación y productos.

**Brechas críticas identificadas** (impactan en % de logro):
⚠️ Falta endpoint `/me` (obtener datos del usuario autenticado) — **IE3.3.2 incompleto**.
⚠️ Falta refresh token (solo access token) — **IE3.3.1 parcial**.
⚠️ Modelos Pedido/DetallePedido/Payment no encontrados en el árbol actual — **IE3.1.1 incompleto**.
⚠️ Falta controlador PedidoController/PaymentController — **IE3.2.1 incompleto**.
⚠️ Documentación markdown (DOCUMENTO_INTEGRACION.md, MANUAL_USUARIO.md) no hallada — **Entregables faltantes**.
⚠️ Tests de pago (PaymentIntegrationTest) no encontrados — **IE3.2.1, IE3.3.1 sin evidencia**.

**Recomendación**: Este informe mapea el estado actual ("Desempeño aceptable" a "Buen desempeño" en varios indicadores). Las acciones prioritarias son: (1) localizar/crear modelos Pedido/Payment, (2) implementar endpoint /me y refresh token, (3) crear tests de integración para pagos, (4) documentar flujos en Markdown. Ver secciones de brechas y recomendaciones abajo.

---

## PARTE 1: ANÁLISIS POR INDICADOR DE EVALUACIÓN (IE)

### Situación Evaluativa 1: ENCARGO (40% de la evaluación)

---

#### **IE3.1.1: Crea una aplicación backend con conexión a una base de datos, implementando lógica de negocio y modelos de datos, acorde a los requerimientos establecidos por el cliente.**

**Criterio de logro**: Desempeño aceptable → Buen desempeño (60-80%)

**Estado actual verificado**:
- ✅ **Conexión a BD**: Configurada contra H2 (en memoria, ideal para desarrollo/tests).
  - URL: `jdbc:h2:mem:pasteleria`
  - Configuración JPA: `spring.jpa.hibernate.ddl-auto=update` (actualiza schema automáticamente).
  - Console H2 habilitada para inspección.

- ✅ **Modelos de datos básicos** (verificados):
  - `Usuario.java` — atributos: id, username, password, roles (relación @ManyToMany con Rol).
  - `Rol.java` — atributos: id, nombre (ej: ROLE_USER, ROLE_ADMIN).
  - `Producto.java` — atributos: id, nombre, descripción, precio.
  - DTOs: `AuthenticationRequest`, `AuthenticationResponse`, `RegisterRequest`.

- ⚠️ **Modelos faltantes** (mencionados en resumen pero no localizados):
  - `Pedido.java` — encabezado de orden del cliente.
  - `DetallePedido.java` — líneas de pedido (producto + cantidad).
  - `Payment.java` — transacción de pago.

- ✅ **Lógica de negocio básica** (verificada):
  - `UsuarioService.register()` — validación de usuario único, encriptación de contraseña (BCrypt), asignación de rol por defecto.
  - `ProductoService` — operaciones CRUD estándar (presumido; revisar contenido).

- ⚠️ **Lógica de negocio faltante**:
  - Confirmación de pedido al completarse pago (PedidoService.confirmOrderFromPayment).
  - Decrementación de stock y manejo de InsufficientStockException.

**Evidencia de calidad**:
- Uso de patrones: Entity-Repository-Service (arquitectura estándar Spring Boot).
- Gestión de contraseñas: PasswordEncoder (BCryptPasswordEncoder).
- Validación de datos: controlada en servicio (ej: existsByUsername).

**Brecha principal**: Modelos Pedido, DetallePedido y Payment no están en el árbol. **Acción**: localizar/crear estos archivos y validar relaciones (Pedido → Usuario, DetallePedido → Pedido, Payment → Pedido).

**Desempeño estimado**: 70% (Desempeño aceptable). Se cumple con la conexión a BD y modelos básicos, pero faltan Pedido/Payment.

---

#### **IE3.2.1: Implementa en el backend servicios de API REST utilizando Spring Boot, incorporando endpoints para realizar operaciones de lectura, creación, actualización y eliminación de registros, mostrando los endpoint en Swagger.**

**Criterio de logro**: Desempeño aceptable → Buen desempeño (60-80%)

**Estado actual verificado**:

- ✅ **Endpoints CRUD existentes** (verificados):
  - `ProductoController`:
    - `GET /api/productos` — listar todos (acceso: USER/ADMIN).
    - `GET /api/productos/{id}` — obtener por id (acceso: USER/ADMIN).
    - `POST /api/productos` — crear (acceso: ADMIN).
    - `PUT /api/productos/{id}` — actualizar (acceso: ADMIN).
    - `DELETE /api/productos/{id}` — eliminar (acceso: ADMIN).

  - `AuthController`:
    - `POST /api/auth/register` — registrar usuario (acceso: público).
    - `POST /api/auth/login` — login (acceso: público).

- ⚠️ **Endpoints faltantes**:
  - `GET /auth/me` o `GET /me` — obtener datos del usuario autenticado (mencionado en tu resumen, **crítico para IE3.3.2**).
  - `POST /auth/refresh` — refresh token (mencionado, crítico para IE3.3.1).
  - `PedidoController` (no encontrado) — CRUD para pedidos.
  - `PaymentController` (no encontrado) — create, commit, status, webhook.

- ✅ **Documentación Swagger/OpenAPI**:
  - SpringDoc integrado: dependencia `springdoc-openapi-starter-webmvc-ui` v2.2.0 en `pom.xml`.
  - Propiedades habilitadas:
    - `springdoc.api-docs.enabled=true` (generación de JSON OpenAPI).
    - `springdoc.swagger-ui.enabled=true` (UI en `/swagger-ui.html`).
  - Rutas permitidas sin autenticación: `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html` (en SecurityConfig).
  - ✅ Swagger accesible en `http://localhost:8080/swagger-ui.html` (presumido funcionando).

- ✅ **Uso de anotaciones**:
  - `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, etc.
  - `@PreAuthorize("hasRole('ADMIN')")` para control granular de acceso.
  - `@CrossOrigin("*")` para CORS (permite desde frontend).

**Desempeño estimado**: 70% (Desempeño aceptable). Endpoints CRUD de Producto y Auth funcionales, Swagger habilitado, pero faltan endpoints de Pedido y Payment + refresh/me.

---

#### **IE3.2.2: Implementa integración entre servicios de backend y frontend mediante la comunicación de la API REST.**

**Criterio de logro**: No puede ser evaluado completamente sin acceso al código frontend.

**Estado actual verificado (backend)**:
- ✅ **Configuración CORS**: `@CrossOrigin("*")` en AuthController y ProductoController — permite requests desde cualquier origen.
- ✅ **Endpoints con response en JSON**: JwtService genera tokens, AuthenticationResponse devuelve token+username.
- ✅ **Formato estándar**: ResponseEntity<?> para manejo flexible de respuestas.
- ✅ **Manejo de errores básico**: AuthController captura AuthenticationException y devuelve 401.

**Falta en backend**:
- Documentación explícita del flujo frontend-backend (en DOCUMENTO_INTEGRACION.md — no hallado).
- Ejemplos de payloads de request/response.
- Manejo robusto de errores con códigos HTTP específicos.

**Desempeño estimado (backend)**: 60% (Desempeño aceptable). La integración es posible, pero sin documentación y sin evidencia del lado frontend, no puede validarse completamente. **Próximo paso**: ejecutar presentación y revisar frontend.

---

#### **IE3.3.1: Implementa autenticación de usuarios en el backend utilizando roles para asegurar que solo los usuarios autorizados puedan acceder a ciertos recursos, utilizando la autentificación basada en tokens (JWT).**

**Criterio de logro**: Desempeño aceptable → Buen desempeño (60-80%)

**Estado actual verificado**:

- ✅ **Generación de JWT**:
  - `JwtService.generateToken(UserDetails)` — crea token con subject (username), issued-at, expiration, firma HMAC-SHA256.
  - Expiración configurable: `jwt.expirationMs=86400000` (24 horas).
  - Secreto seguro: base64-encoded (MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=, 32 bytes en base64 = 24 bytes decoded).

- ✅ **Validación de JWT**:
  - `JwtService.isTokenValid(token, UserDetails)` — verifica firma, username y expiración.
  - Extracción de claims: `extractUsername`, `extractClaim`, `extractExpiration`.

- ✅ **Filtro de autenticación**:
  - `JwtAuthenticationFilter` (clase presente en security/; contenido no verificado pero referenciado en SecurityConfig).
  - Integrado en chain: `.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`.

- ✅ **Gestión de roles**:
  - `Usuario` tiene `Set<Rol>` (relación ManyToMany).
  - Registro asigna automáticamente `ROLE_USER` por defecto.
  - `SecurityConfig` usa `@PreAuthorize` y `hasRole()` para control granular.
  - Endpoints protegidos:
    - `GET /api/productos` — `hasAnyRole("USER","ADMIN")`.
    - `POST/PUT/DELETE /api/productos` — `hasRole("ADMIN")`.

- ⚠️ **Falta refresh token**:
  - Solo se genera access token (24h).
  - No hay endpoint `/auth/refresh` para renovar token sin volver a loguearse.
  - Esto viola la mejor práctica de JWT (short-lived access + long-lived refresh token).
  - **Impacto**: usuarios expulsados después de 24 horas de inactividad.

- ⚠️ **Falta endpoint /me**:
  - No hay endpoint para obtener datos del usuario autenticado.
  - Frontend no puede verificar identidad del usuario tras recarga de página sin ir a `/me`.

**Desempeño estimado**: 70% (Desempeño aceptable). JWT, roles y control de acceso funcionan, pero falta refresh token y endpoint /me — son críticos para una solución "muy buen desempeño".

---

#### **IE3.3.2: Desarrolla un sistema de gestión de sesiones en el frontend que mantenga el estado de autenticación del usuario de manera segura, permitiendo la persistencia de la sesión incluso en caso de recargas de página.**

**Criterio de logro**: No puede ser evaluado completamente sin acceso al código frontend.

**Estado actual verificado (backend)**:
- ✅ **Sesiones stateless**: `SessionCreationPolicy.STATELESS` en SecurityConfig — backend no mantiene sesión HTTP (ideal para SPA + JWT).
- ✅ **Token en JWT**: contiene username y expiración — suficiente para frontend validar identidad.

**Requiere validación en frontend**:
- ¿Almacena token en localStorage/sessionStorage/cookie segura?
- ¿Valida expiración y renueva automáticamente?
- ¿Persiste sesión tras recargas?

**Falta en backend** (crítico para completar este indicador):
- Endpoint `/auth/me` — frontend debe llamarlo tras recargar para verificar que el token aún es válido.
- Endpoint `/auth/refresh` — frontend debe llamarlo cuando token expire.

**Desempeño estimado (backend)**: 50% (Desempeño incipiente). Backend está listo (stateless + JWT), pero sin /me y /refresh, frontend no puede gestionar sesiones de forma robusta.

---

#### **IE3.3.3: Desarrolla restricciones de acceso a funcionalidades en el frontend, asegurando que las interfaces y acciones sean accesibles únicamente por usuarios con los permisos adecuados.**

**Criterio de logro**: No puede ser evaluado completamente sin acceso al código frontend.

**Estado actual verificado (backend)**:
- ✅ **Control de acceso en backend**: 
  - Endpoints protegidos con `@PreAuthorize` y `hasRole()`.
  - Usuario sin token → 401 Unauthorized.
  - Usuario con token pero sin rol ADMIN → 403 Forbidden (para crear/actualizar/eliminar productos).

**Requiere validación en frontend**:
- ¿Oculta botones/menús según rol?
- ¿Valida rol antes de enviar request?
- ¿Maneja respuestas 401/403 correctamente?

**Desempeño estimado (backend)**: 80% (Buen desempeño). Backend protege recursos correctamente; frontend debe implementar UI acorde.

---

### Situación Evaluativa 2: PRESENTACIÓN (60% de la evaluación)

Cada estudiante debe describir/explicar/justificar los puntos IE3.1.2 a IE3.3.6. La evaluación será **individual**, por lo que cada miembro del equipo debe estar preparado para:

1. **IE3.1.2**: Describir cómo se desarrolló el backend (BD, modelos, lógica).
2. **IE3.2.3**: Explicar cómo se implementaron endpoints REST y Swagger.
3. **IE3.2.4**: Justificar la integración frontend-backend (flujo de datos).
4. **IE3.3.4**: Describir JWT, generación, validación, renovación.
5. **IE3.3.5**: Exponer gestión de sesiones en frontend.
6. **IE3.3.6**: Explicar restricciones de acceso en frontend (por rol).

**Nota**: La presentación ocurrirá presencialmente en taller. Este informe proporciona las bases técnicas para la presentación.

---

## PARTE 2: CHECKLIST DE ENTREGABLES (RÚBRICA)

### Archivos requeridos (según rúbrica, sección "Documentos requeridos del proyecto por el grupo"):

| Entregable | Estado | Path esperado | Observación |
|---|---|---|---|
| Enlace GitHub público (frontend) | ❓ | - | No proporcionado. Necesario para evaluación. |
| Enlace GitHub público (backend) | ❓ | - | No proporcionado. Necesario para evaluación. |
| Proyecto frontend comprimido | ❓ | - | No proporcionado. Necesario para evaluación. |
| Proyecto backend comprimido | ❓ | - | Directorio `c:\Users\Bruno\Desktop\backend` accesible. |
| Manual de usuario | ❌ | `MANUAL_USUARIO.md` | **NO ENCONTRADO**. Requerido. |
| Documento de integración | ❌ | `DOCUMENTO_INTEGRACION.md` | **NO ENCONTRADO**. Requerido. |

---

## PARTE 3: BRECHAS IDENTIFICADAS Y PRIORIDAD DE RESOLUCIÓN

### Brechas Críticas (Alta Prioridad)

#### 1. **Falta endpoint GET /auth/me** ⛔ CRÍTICO
- **Impacto**: IE3.3.2 (gestión de sesiones frontend) no puede completarse.
- **Descripción**: Frontend necesita validar que el token aún es válido tras recargar la página. Sin este endpoint, no hay forma de saber si el usuario está autenticado sin un login adicional.
- **Solución propuesta**:
  ```java
  @GetMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> getMe() {
      String username = SecurityContextHolder.getContext().getAuthentication().getName();
      Usuario usuario = usuarioService.findByUsername(username)
          .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
      return ResponseEntity.ok(new UsuarioDTO(usuario.getId(), usuario.getUsername(), usuario.getRoles()));
  }
  ```
- **Estimado de esfuerzo**: 30 min (incluye crear UsuarioDTO).

#### 2. **Falta endpoint POST /auth/refresh (refresh token)** ⛔ CRÍTICO
- **Impacto**: IE3.3.1 (JWT con renovación) incompleto. Usuarios expulsados después de 24h.
- **Descripción**: Backend genera access token de 24h sin refresh token. Mejor práctica: access token corta duración (ej: 15 min) + refresh token larga duración (ej: 7 días).
- **Solución propuesta**:
  - Crear entidad `RefreshToken` (BD) con fields: id, token, usuarioId, expiryDate.
  - Endpoint `/auth/refresh` que recibe token viejo, valida expiración, genera nuevo access token.
  - Implementar `RefreshTokenService` con métodos create, validate, delete.
- **Estimado de esfuerzo**: 2-3 horas (modelo + servicio + endpoint + tests).

#### 3. **Falta modelosPedido/DetallePedido/Payment** ⛔ CRÍTICO
- **Impacto**: IE3.1.1 (modelos de datos) y IE3.2.1 (CRUD endpoints) incompletos.
- **Descripción**: Mencionados en tu resumen, pero no localizados en el árbol actual. Necesarios para ordenar productos y registrar pagos.
- **Solución propuesta**: Crear archivos en `src/main/java/com/pasteleria/backend/model/`:
  - `Pedido.java`: id, usuarioId, estado (CREATED, CONFIRMED, CANCELLED), total, fechaCreacion, fechaActualizacion.
  - `DetallePedido.java`: id, pedidoId, productoId, cantidad, precioUnitario.
  - `Payment.java`: id, txId, pedidoId, amount, estado (CREATED, COMMITTED, FAILED), fechaCreacion.
- **Estimado de esfuerzo**: 1-2 horas (modelos + repositorios).

#### 4. **Falta PedidoController y PaymentController** ⛔ CRÍTICO
- **Impacto**: IE3.2.1 (endpoints REST para CRUD).
- **Descripción**: Sin controladores, no hay endpoints para crear/listar pedidos ni registrar/consultar pagos.
- **Solución propuesta**:
  - `PedidoController`: POST (crear), GET (listar), GET /{id}, PUT (actualizar estado), DELETE.
  - `PaymentController`: POST /create, POST /commit/{tx}, GET /status/{tx}, POST /webhook.
- **Estimado de esfuerzo**: 2-3 horas (controladores + servicios + tests).

#### 5. **Falta MANUAL_USUARIO.md y DOCUMENTO_INTEGRACION.md** ⛔ CRÍTICO
- **Impacto**: Entregable obligatorio no cumplido.
- **Descripción**: Documentación necesaria para que los evaluadores y usuarios finales entiendan cómo usar la aplicación.
- **Solución propuesta**:
  - `MANUAL_USUARIO.md`: capturas de pantalla, pasos para registrar, login, crear pedido, pagar, ver historial.
  - `DOCUMENTO_INTEGRACION.md`: descripción de endpoints REST, flujos de autenticación, ejemplos de payloads (cURL, Postman), respuestas esperadas, códigos de error.
- **Estimado de esfuerzo**: 2-3 horas (documentación detallada).

### Brechas Medianas (Media Prioridad)

#### 6. **Falta InsufficientStockException y manejo de stock en Producto** ⚠️ MEDIA
- **Impacto**: IE3.1.1 (lógica de negocio), IE3.3.1 (control de acceso a operaciones).
- **Descripción**: Producto debe tener campo `stock`. Al confirmar un pedido, se debe decrementar stock; si no hay stock suficiente, lanzar excepción y retornar 409 Conflict.
- **Solución propuesta**:
  - Añadir campo `stock` a `Producto`.
  - Crear `InsufficientStockException`.
  - Implementar `PedidoService.confirmOrderFromPayment(paymentId)` que decrementa stock (transaccional).
  - Crear `@ControllerAdvice` para mapear excepción a 409.
- **Estimado de esfuerzo**: 1.5-2 horas.

#### 7. **Falta PaymentIntegrationTest** ⚠️ MEDIA
- **Impacto**: IE3.2.1 (endpoints funcionales), IE3.3.1 (autenticación), evidencia de calidad.
- **Descripción**: Test mencionado en tu resumen (corrupto, fue limpiado). Necesario para validar flujo create → commit y caso stock insuficiente.
- **Solución propuesta**:
  - Escribir test que crea pedido, inicia pago (POST /api/payments/create), confirma pago (POST /api/payments/commit/{tx}), valida que pedido está CONFIRMED y stock decrementado.
  - Escribir test para caso stock insuficiente (espera excepción y HTTP 409).
- **Estimado de esfuerzo**: 1-1.5 horas.

#### 8. **Falta @Transactional en PedidoService.confirmOrderFromPayment** ⚠️ MEDIA
- **Impacto**: Integridad de datos (si decrementar stock falla, pedido no debe quedar CONFIRMED).
- **Solución propuesta**: Anotar método con `@Transactional` y capturar excepciones adecuadamente.
- **Estimado de esfuerzo**: 0.5 horas.

### Brechas Menores (Baja Prioridad)

#### 9. **Falta HELP.md** 🔄 BAJA
- **Impacto**: Documentación general del proyecto.
- **Solución propuesta**: Archivo de bienvenida con instrucciones de compilación, ejecución, estructura del proyecto.
- **Estimado de esfuerzo**: 1 hora.

#### 10. **Falta documentación en código (Javadoc/comentarios)** 🔄 BAJA
- **Impacto**: Claridad y mantenibilidad.
- **Solución propuesta**: Añadir comentarios Javadoc a servicios y controladores complejos.
- **Estimado de esfuerzo**: 1-2 horas.

---

## PARTE 4: RECOMENDACIONES CONCRETAS Y ROADMAP

### Hoja de Ruta (Próximos Pasos)

#### **SEMANA 1 — TAREAS INMEDIATAS (Antes de presentación)**

**Prioridad 1 (Día 1-2): Implementar endpoints críticos**
1. Crear modelo `RefreshToken` y servicio.
2. Implementar endpoint `POST /auth/refresh` y `GET /auth/me`.
3. Actualizar `AuthController` con estos endpoints.
4. Test manualmente con Postman/cURL.

**Prioridad 2 (Día 2-3): Crear modelos de dominio faltantes**
1. Crear `Pedido.java`, `DetallePedido.java`, `Payment.java`.
2. Crear repositorios (`PedidoRepository`, `DetallePedidoRepository`, `PaymentRepository`).
3. Crear servicios (`PedidoService`, `PaymentService`).
4. Crear controladores (`PedidoController`, `PaymentController`).
5. Escribir tests de integración para cada uno.

**Prioridad 3 (Día 3-4): Implementar lógica de negocio crítica**
1. Añadir campo `stock` a `Producto` (y migración DB).
2. Crear `InsufficientStockException`.
3. Implementar `PedidoService.confirmOrderFromPayment(...)` con `@Transactional`.
4. Crear `@ControllerAdvice` para manejo de excepciones (409 Conflict para stock insuficiente).
5. Escribir `PaymentIntegrationTest` (flujo happy-path + stock insuficiente).

**Prioridad 4 (Día 4-5): Documentación**
1. Crear `DOCUMENTO_INTEGRACION.md` con:
   - Lista de endpoints (tabla con rutas, métodos, respuestas).
   - Flujos clave (login → create pedido → pagar → confirm).
   - Ejemplos de cURL/Postman para cada endpoint.
   - Respuestas esperadas y códigos de error.
2. Crear `MANUAL_USUARIO.md` con:
   - Pantallazos del frontend (o descripción si aún no existen).
   - Pasos del usuario final (registrar, login, crear pedido, pagar).
   - FAQs.
3. Actualizar `HELP.md` con instrucciones de compilación/ejecución.

#### **SEMANA 2 — PREPARACIÓN PARA PRESENTACIÓN**

1. Compilar y ejecutar tests:
   ```powershell
   .\mvnw clean test
   ```
2. Validar que todos los tests pasan (incluido PaymentIntegrationTest).
3. Ejecutar aplicación en local:
   ```powershell
   .\mvnw spring-boot:run
   ```
4. Acceder a Swagger en `http://localhost:8080/swagger-ui.html` y validar que todos los endpoints estén documentados.
5. Preparar demostración en vivo (o video grabado):
   - Registrar usuario.
   - Login (recibir token).
   - Llamar a `/me` para validar sesión.
   - Crear pedido.
   - Crear pago.
   - Validar stock decrementado.
6. Preparar presentación oral (cada estudiante):
   - Describir arquitectura del backend.
   - Explicar flujo JWT y refresh token.
   - Justificar decisiones de diseño.

---

## PARTE 5: ESTADO ACTUAL PORMENORIZADO POR INDICADOR

### Tabla de Cumplimiento (Baseline actual)

| Indicador | Descripción | % Logro | Observación | Acción Prioritaria |
|---|---|---|---|---|
| **IE3.1.1** | Backend + BD + Modelos + Lógica | 70% | Conexión y modelos básicos OK; falta Pedido/Payment | Crear modelos faltantes |
| **IE3.2.1** | Endpoints REST CRUD + Swagger | 70% | Auth y Producto endpoints OK; falta Pedido/Payment; Swagger OK | Crear controladores faltantes |
| **IE3.2.2** | Integración frontend-backend REST | 60% | CORS OK; flujo básico OK; falta documentación y endpoints críticos | Documentar en DOCUMENTO_INTEGRACION.md |
| **IE3.3.1** | Autenticación JWT + Roles | 70% | Generación, validación, roles OK; falta refresh token y /me | Implementar refresh token y /me |
| **IE3.3.2** | Sesiones frontend (persistencia) | 50% | Backend stateless; falta /me y /refresh para frontend | Implementar /me y /refresh |
| **IE3.3.3** | Restricciones acceso frontend | 80% | Backend protege recursos; frontend pendiente de validación | Validar en presentación frontend |
| **IE3.1.2** | Presentación: describir backend | — | Aún no evaluado | Preparar explicación clara |
| **IE3.2.3** | Presentación: explicar endpoints + Swagger | — | Aún no evaluado | Practicar explicación |
| **IE3.2.4** | Presentación: justificar integración | — | Aún no evaluado | Documentar flujos en DOCUMENTO_INTEGRACION.md |
| **IE3.3.4** | Presentación: describir JWT | — | Aún no evaluado | Preparar explicación técnica |
| **IE3.3.5** | Presentación: exponer sesiones frontend | — | Aún no evaluado | Revisar código frontend |
| **IE3.3.6** | Presentación: explicar restricciones | — | Aún no evaluado | Revisar código frontend |

---

## PARTE 6: BLOQUEADORES Y DEPENDENCIAS

### Bloqueadores Identificados

1. **Modelos Pedido/Payment no localizados** → Bloquea IE3.1.1, IE3.2.1, IE3.3.1.
   - **Causa probable**: Cambios en otra rama (git), no commiteados, o path distinto.
   - **Resolución**: Confirmar rama actual; si no existen, crearlos (prioridad 1).

2. **No hay acceso a código frontend** → Bloquea IE3.3.2, IE3.3.3, IE3.3.5, IE3.3.6 (validación).
   - **Causa probable**: Frontend aún en desarrollo o en otro repositorio.
   - **Resolución**: Necesario en presentación en vivo o proyecto comprimido entregado.

3. **Tests de pago no encontrados o corruptos** → Bloquea validación de lógica de pagos.
   - **Resolución**: Reescribir test (prioridad 2).

---

## PARTE 7: VALIDACIÓN DE COMPILACIÓN Y TESTS

### Comando para validar estado actual (local):

```powershell
# Navegar al directorio del backend
cd c:\Users\Bruno\Desktop\backend\backend

# Limpiar y compilar
.\mvnw clean compile

# Ejecutar tests
.\mvnw test

# Si todo OK, ejecutar aplicación
.\mvnw spring-boot:run
```

**Salida esperada**:
- Compilación: `BUILD SUCCESS`.
- Tests: todos los tests deben pasar (ej: AuthControllerIntegrationTest, ProductoControllerIntegrationTest).
- Aplicación: Inicia sin errores, accesible en `http://localhost:8080`.

**Si hay errores**, ejecutar nuevamente con verbosidad:
```powershell
.\mvnw -X test
```

---

## PARTE 8: CHECKLIST FINAL PARA LA ENTREGA

- [ ] Modelos Pedido, DetallePedido, Payment creados.
- [ ] Producto tiene campo `stock`.
- [ ] PedidoController y PaymentController implementados.
- [ ] PedidoService y PaymentService implementados.
- [ ] InsufficientStockException creado y manejado en @ControllerAdvice.
- [ ] Endpoint `GET /auth/me` implementado.
- [ ] Endpoint `POST /auth/refresh` implementado.
- [ ] RefreshToken model y RefreshTokenService creados.
- [ ] PaymentIntegrationTest escrito y pasando.
- [ ] Producto + Auth integration tests pasando.
- [ ] DOCUMENTO_INTEGRACION.md creado con ejemplos.
- [ ] MANUAL_USUARIO.md creado.
- [ ] HELP.md actualizado.
- [ ] `.\mvnw clean test` ejecuta sin errores (BUILD SUCCESS).
- [ ] Swagger accesible en `/swagger-ui.html` con todos los endpoints documentados.
- [ ] Código comprimido (backend + frontend si existe).
- [ ] Enlaces GitHub públicos compartidos.
- [ ] Cada estudiante preparado para presentación individual.

---

## CONCLUSIONES Y RECOMENDACIÓN FINAL

El backend ha alcanzado un nivel de desarrollo **Desempeño Aceptable a Buen Desempeño** en varios indicadores. Las brechas críticas (refresh token, /me, Pedido/Payment) son **resolubles en 3-5 días** de trabajo focalizados. 

**Evaluación proyectada** (si se implementan todas las recomendaciones):
- Situación Evaluativa 1 (Encargo, 40%): **80-100%** (Buen a Muy buen desempeño).
- Situación Evaluativa 2 (Presentación, 60%): **70-90%** (depende de claridad y profundidad en la presentación oral).
- **Nota final estimada**: 75-95% (dentro del rango de éxito).

**Próximo paso recomendado**: Priorizar la implementación de los 4 puntos críticos (refresh token, /me, Pedido/Payment, documentación) y después testear exhaustivamente.

---

**Informe generado**: 27 de noviembre de 2024  
**Redactado por**: Sistema de Evaluación Técnica  
**Dirigido a**: Equipo de desarrollo DSY1104

