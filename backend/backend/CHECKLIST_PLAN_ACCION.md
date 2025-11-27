# CHECKLIST Y PLAN DE ACCIÓN — DSY1104 Evaluación Parcial N°3

**Proyecto**: Pastelería Backend + Frontend  
**Fecha de Informe**: 27 de noviembre de 2024  
**Plazo de Entrega**: 1 semana  
**Ponderación**: 40% encargo (grupal) + 60% presentación (individual)

---

## RESUMEN RÁPIDO DE ESTADO

| Aspecto | Estado | % Completado | Prioridad |
|---------|--------|--------------|-----------|
| Backend básico (Auth + Productos) | ✅ Listo | 70% | — |
| Documentación (3 archivos) | ✅ Creado | 100% | Entrega |
| Modelos Pedido/Payment | ❌ Falta | 0% | 🔴 CRÍTICA |
| Endpoint /me y /refresh | ❌ Falta | 0% | 🔴 CRÍTICA |
| Tests de integración (Pago) | ❌ Falta | 0% | 🟠 ALTA |
| Frontend | ❓ Pendiente | — | 🔴 CRÍTICA |

---

## PARTE 1: TAREAS CRÍTICAS (HACER ANTES DE PRESENTACIÓN)

### 🔴 TAREA 1.1: Implementar Endpoint /auth/me
- **Responsable**: [Nombre]
- **Duración estimada**: 30 min
- **Descripción**: Agregar endpoint GET `/auth/me` que retorna datos del usuario autenticado.
- **Archivos a modificar**:
  - `AuthController.java` — añadir método `getMe()`.
  - Crear `UsuarioDTO.java` si no existe.
- **Código plantilla**:
  ```java
  @GetMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> getMe() {
      String username = SecurityContextHolder.getContext().getAuthentication().getName();
      Usuario usuario = usuarioService.findByUsername(username)
          .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
      return ResponseEntity.ok(new UsuarioDTO(usuario));
  }
  ```
- **Validación**: `curl -H "Authorization: Bearer <token>" http://localhost:8080/api/auth/me` debe retornar 200 con datos usuario.
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.2: Implementar Endpoint /auth/refresh
- **Responsable**: [Nombre]
- **Duración estimada**: 2-3 horas
- **Descripción**: Agregar refresh token con endpoint POST `/auth/refresh`.
- **Archivos a crear/modificar**:
  - `RefreshToken.java` (modelo).
  - `RefreshTokenRepository.java`.
  - `RefreshTokenService.java` (lógica).
  - `AuthController.java` — añadir método `refresh()`.
- **Paso a paso**:
  1. Crear modelo `RefreshToken` (id, token, usuarioId, expiryDate).
  2. Crear repositorio con método `findByToken()`, `findByUsuario()`.
  3. Crear servicio: `createRefreshToken()`, `validateRefreshToken()`, `deleteRefreshToken()`.
  4. Modificar `AuthController.register()` y `login()` para retornar tanto access token como refresh token.
  5. Crear endpoint POST `/auth/refresh` que toma refreshToken en body y devuelve nuevo access token.
  6. Escribir test `RefreshTokenIntegrationTest`.
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.3: Crear Modelos Pedido y DetallePedido
- **Responsable**: [Nombre]
- **Duración estimada**: 1-2 horas
- **Descripción**: Crear entidades Pedido y DetallePedido con relaciones.
- **Archivos a crear**:
  - `Pedido.java` (modelo JPA).
  - `DetallePedido.java` (modelo JPA).
  - `PedidoRepository.java`.
  - `DetallePedidoRepository.java`.
- **Estructura Pedido**:
  ```java
  @Entity
  public class Pedido {
    @Id @GeneratedValue private Long id;
    @ManyToOne private Usuario usuario;
    private String estado; // CREATED, CONFIRMED, SHIPPED, CANCELLED
    private Double total;
    @OneToMany(mappedBy = "pedido") private Set<DetallePedido> detalles;
    private LocalDateTime fechaCreacion;
    // getters/setters
  }
  ```
- **Estructura DetallePedido**:
  ```java
  @Entity
  public class DetallePedido {
    @Id @GeneratedValue private Long id;
    @ManyToOne private Pedido pedido;
    @ManyToOne private Producto producto;
    private Integer cantidad;
    private Double precioUnitario;
    // getters/setters
  }
  ```
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.4: Crear Modelo Payment
- **Responsable**: [Nombre]
- **Duración estimada**: 1 hora
- **Descripción**: Crear entidad Payment para registrar transacciones de pago.
- **Archivos a crear**:
  - `Payment.java` (modelo JPA).
  - `PaymentRepository.java`.
- **Estructura Payment**:
  ```java
  @Entity
  public class Payment {
    @Id @GeneratedValue private Long id;
    private String txId; // ID de transacción único
    @ManyToOne private Pedido pedido;
    private Double amount;
    private String currency; // USD, EUR, etc.
    private String estado; // CREATED, COMMITTED, FAILED
    private LocalDateTime fechaCreacion;
    // getters/setters
  }
  ```
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.5: Actualizar Producto con campo stock
- **Responsable**: [Nombre]
- **Duración estimada**: 30 min
- **Descripción**: Añadir campo `stock` a entidad Producto.
- **Archivos a modificar**:
  - `Producto.java` — añadir `Integer stock`.
- **Código**:
  ```java
  @Entity
  public class Producto {
    // ... campos existentes ...
    private Integer stock; // cantidad disponible
    // getters/setters
  }
  ```
- **Nota**: H2 migrará automáticamente (`ddl-auto=update`).
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.6: Crear Servicio de Pedidos (PedidoService)
- **Responsable**: [Nombre]
- **Duración estimada**: 1-2 horas
- **Descripción**: Implementar lógica de negocio para pedidos.
- **Archivos a crear**:
  - `PedidoService.java`.
- **Métodos principales**:
  ```java
  @Service
  public class PedidoService {
    // Crear pedido desde items del carrito
    public Pedido crearPedido(Long usuarioId, List<ItemCarrito> items) { ... }
    
    // Confirmar pedido cuando se completa pago
    @Transactional
    public Pedido confirmOrderFromPayment(Long paymentId) { ... }
    
    // Obtener pedido por ID
    public Pedido getPedidoById(Long id) { ... }
    
    // Listar pedidos del usuario
    public List<Pedido> getPedidosByUsuario(Long usuarioId) { ... }
  }
  ```
- **Lógica crítica en `confirmOrderFromPayment()`**:
  1. Obtener Pedido y Payment.
  2. Para cada DetallePedido: validar stock suficiente.
  3. Si alguno falla: lanzar `InsufficientStockException`.
  4. Si OK: decrementar stock de cada producto, marcar pedido CONFIRMED, marcar pago COMMITTED.
  5. Usar `@Transactional` para rollback automático si falla.
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.7: Crear Servicio de Pagos (PaymentService)
- **Responsable**: [Nombre]
- **Duración estimada**: 1-2 horas
- **Descripción**: Implementar lógica de iniciar, confirmar y validar pagos.
- **Archivos a crear**:
  - `PaymentService.java`.
- **Métodos principales**:
  ```java
  @Service
  public class PaymentService {
    // Iniciar pago (crear transacción)
    public Payment crearPago(Long pedidoId, Double amount, String currency) { ... }
    
    // Confirmar pago (commit)
    public Payment confirmarPago(String txId) { ... }
    
    // Obtener estado del pago
    public Payment obtenerPago(String txId) { ... }
    
    // Webhook (notificación de proveedor de pago)
    public void procesarWebhook(WebhookPayload payload) { ... }
  }
  ```
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.8: Crear Excepción InsufficientStockException
- **Responsable**: [Nombre]
- **Duración estimada**: 30 min
- **Descripción**: Crear excepción personalizada para stock insuficiente.
- **Archivos a crear**:
  - `InsufficientStockException.java`.
- **Código**:
  ```java
  public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
      super(message);
    }
  }
  ```
- **Crear `@ControllerAdvice` para manejar**:
  ```java
  @ControllerAdvice
  public class GlobalExceptionHandler {
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<?> handleInsufficientStock(InsufficientStockException ex) {
      return ResponseEntity.status(409).body(new ErrorResponse("Stock insuficiente", ex.getMessage()));
    }
  }
  ```
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.9: Crear Controladores REST
- **Responsable**: [Nombre]
- **Duración estimada**: 2-3 horas
- **Descripción**: Crear PedidoController y PaymentController con endpoints CRUD.
- **Archivos a crear**:
  - `PedidoController.java` — POST, GET, GET /{id}, PUT, DELETE.
  - `PaymentController.java` — POST /create, POST /commit/{tx}, GET /status/{tx}, POST /webhook.
- **Endpoints Pedido**:
  ```java
  POST /api/pedidos — crear pedido
  GET /api/pedidos — listar mis pedidos
  GET /api/pedidos/{id} — obtener pedido por ID
  PUT /api/pedidos/{id} — actualizar estado
  DELETE /api/pedidos/{id} — cancelar pedido
  ```
- **Endpoints Pago** (similar al documento de integración):
  ```java
  POST /api/payments/create — iniciar pago
  POST /api/payments/commit/{tx} — confirmar pago
  GET /api/payments/status/{tx} — obtener estado
  POST /api/payments/webhook — webhook
  ```
- **[  ] COMPLETADO**

---

### 🔴 TAREA 1.10: Escribir Tests de Integración
- **Responsable**: [Nombre]
- **Duración estimada**: 2-3 horas
- **Descripción**: Crear tests completos para PaymentIntegrationTest y otros.
- **Archivos a crear**:
  - `PaymentIntegrationTest.java` — flujo create → commit, stock insuficiente.
  - `PedidoControllerIntegrationTest.java` — CRUD pedidos.
  - `RefreshTokenIntegrationTest.java` — refresh token.
- **Casos de test principales**:
  1. Crear pedido sin stock → debe fallar.
  2. Crear pago → commit exitoso → pedido CONFIRMED, stock decrementado.
  3. Commit con stock insuficiente → 409 Conflict, pedido no confirmado.
  4. Refresh token expirado → 401 Unauthorized.
  5. Refresh token válido → nuevo access token.
- **Validación**: `.\mvnw test` retorna `BUILD SUCCESS` con 0 fallos.
- **[  ] COMPLETADO**

---

## PARTE 2: TAREAS DE DOCUMENTACIÓN (YA COMPLETADAS)

✅ **TAREA 2.1**: Crear `INFORME_EVALUACION_DSY1104.md`  
✅ **TAREA 2.2**: Crear `DOCUMENTO_INTEGRACION.md`  
✅ **TAREA 2.3**: Crear `MANUAL_USUARIO.md`  
✅ **TAREA 2.4**: Crear `HELP.md`  

---

## PARTE 3: TAREAS DE VALIDACIÓN (DESPUÉS DE TAREAS 1.1-1.10)

### 🟠 TAREA 3.1: Compilación Sin Errores
- **Comando**:
  ```powershell
  .\mvnw clean compile
  ```
- **Esperado**: `BUILD SUCCESS`
- **[  ] COMPLETADO**

---

### 🟠 TAREA 3.2: Tests Pasando
- **Comando**:
  ```powershell
  .\mvnw test
  ```
- **Esperado**: `BUILD SUCCESS`, todos los tests pasan (0 fallos).
- **[  ] COMPLETADO**

---

### 🟠 TAREA 3.3: Ejecutar Aplicación Localmente
- **Comando**:
  ```powershell
  .\mvnw spring-boot:run
  ```
- **Validaciones**:
  - ✅ Aplicación inicia sin errores.
  - ✅ Swagger UI accesible en `http://localhost:8080/swagger-ui.html`.
  - ✅ Todos los endpoints documentados en Swagger.
  - ✅ Pruebas manuales con Postman:
    - Registrar usuario.
    - Login (recibir token).
    - Llamar `/me` (obtener datos usuario).
    - Crear pedido.
    - Crear pago.
    - Confirmar pago (validar stock decrementado).
- **[  ] COMPLETADO**

---

### 🟠 TAREA 3.4: Generar JAR de Producción
- **Comando**:
  ```powershell
  .\mvnw clean package -DskipTests
  ```
- **Esperado**: `BUILD SUCCESS`, archivo `target/backend-0.0.1-SNAPSHOT.jar` generado.
- **[  ] COMPLETADO**

---

## PARTE 4: TAREAS DE PRESENTACIÓN (PARA CADA ESTUDIANTE)

### 📋 TAREA 4.1: Preparar Explicación de Backend (IE3.1.2)
- **Duración**: 2-3 min en presentación.
- **Qué incluir**:
  - Arquitectura: capas (Controller, Service, Repository).
  - Conexión a BD (H2 vs MySQL).
  - Modelos principales (Usuario, Producto, Pedido, Payment).
  - Ejemplo: flujo de registro → creación de usuario en BD.
- **Recursos**:
  - Diagramas (ER, flujo de datos).
  - Código snippets (mostrar en VS Code/IDE durante presentación).
- **[  ] PREPARADO**

---

### 📋 TAREA 4.2: Preparar Explicación de Endpoints REST (IE3.2.3)
- **Duración**: 2-3 min en presentación.
- **Qué incluir**:
  - Endpoints implementados (Auth, Productos, Pedidos, Pagos).
  - Métodos HTTP (GET, POST, PUT, DELETE).
  - Documentación Swagger (mostrar en vivo).
  - Ejemplo de request/response con cURL o Postman.
- **Recursos**:
  - Captura de pantalla de Swagger UI.
  - Comandos cURL de ejemplo.
- **[  ] PREPARADO**

---

### 📋 TAREA 4.3: Preparar Justificación de Integración Frontend-Backend (IE3.2.4)
- **Duración**: 2-3 min en presentación.
- **Qué incluir**:
  - Flujo de datos: frontend → backend → BD → frontend.
  - Método de comunicación: HTTP REST + JSON.
  - Ejemplo: usuario llena formulario → frontend POST → backend guarda → BD actualiza → respuesta JSON → UI renderiza.
  - Eficiencia: CORS, stateless sessions, JWT.
- **Recursos**:
  - Diagramas de secuencia.
  - Network tab del navegador (F12) mostrando requests/responses.
- **[  ] PREPARADO**

---

### 📋 TAREA 4.4: Preparar Descripción de JWT (IE3.3.4)
- **Duración**: 2-3 min en presentación.
- **Qué incluir**:
  - Qué es JWT: estructura (header.payload.signature).
  - Flujo: usuario login → backend genera JWT → frontend almacena → frontend envía en Authorization header → backend valida.
  - Seguridad: HMAC-SHA256 firmado con secreto base64.
  - Expiración: 24h para access token, 7 días para refresh token.
  - Validación: extracción de claims (username, expiración), verificación de firma.
- **Recursos**:
  - Decodificar un JWT en jwt.io (mostrar en vivo).
  - Código de JwtService.java.
- **[  ] PREPARADO**

---

### 📋 TAREA 4.5: Preparar Exposición de Sesiones Frontend (IE3.3.5)
- **Duración**: 2-3 min en presentación.
- **Qué incluir** (validar con código frontend):
  - Almacenamiento seguro: localStorage vs sessionStorage vs cookie HttpOnly.
  - Persistencia: token se mantiene tras recargar página.
  - Validación: al cargar app, frontend verifica token válido llamando `/me`.
  - Renovación: antes de expirar, frontend llama `/refresh` para nuevo access token.
  - Logout: eliminar token del almacenamiento local.
- **Recursos**:
  - Captura de Storage en DevTools (F12).
  - Código React/Vue/Angular de gestión de sesiones.
- **[  ] PREPARADO**

---

### 📋 TAREA 4.6: Preparar Explicación de Restricciones de Acceso Frontend (IE3.3.6)
- **Duración**: 2-3 min en presentación.
- **Qué incluir** (validar con código frontend):
  - Control en frontend: ocultar botones/menús según rol.
  - Validación preventiva: antes de enviar request, verificar rol en localStorage.
  - Control en backend: endpoints retornan 403 si usuario sin permiso.
  - Ejemplo: botón "Crear Producto" visible solo si `ROLE_ADMIN`.
- **Recursos**:
  - Captura de pantalla mostrando diferentes UI para USER vs ADMIN.
  - Código condicional (if rol === 'ADMIN' entonces mostrar botón).
- **[  ] PREPARADO**

---

### 📋 TAREA 4.7: Realizar Demostración en Vivo (Opcional pero Recomendado)
- **Duración**: 3-5 min.
- **Qué mostrar**:
  1. Ejecutar backend: `.\mvnw spring-boot:run`.
  2. Acceder a Swagger UI: http://localhost:8080/swagger-ui.html.
  3. Registrar usuario (POST /api/auth/register).
  4. Login (POST /api/auth/login) → mostrar token en respuesta.
  5. Llamar `/me` con token → mostrar datos usuario.
  6. Listar productos (GET /api/productos).
  7. Crear pedido (POST /api/pedidos) → mostrar respuesta.
  8. Crear pago (POST /api/payments/create) → mostrar txId.
  9. Confirmar pago (POST /api/payments/commit/{txId}) → mostrar pedido CONFIRMED.
  10. Validar stock decrementado en producto.
- **Requisitos**:
  - Notebook con proyector.
  - Acceso a IDE (VS Code, IntelliJ) con código fuente.
  - Conexión a internet (o servidor local disponible).
  - Postman/Thunder Client o Swagger abierto.
- **[  ] COMPLETADO**

---

## PARTE 5: CHECKLIST FINAL (ANTES DE ENTREGA)

### Archivos y Código

- [ ] `Pedido.java` creado y compilable.
- [ ] `DetallePedido.java` creado y compilable.
- [ ] `Payment.java` creado y compilable.
- [ ] `Producto.java` actualizado con campo `stock`.
- [ ] `PedidoService.java` implementado con `confirmOrderFromPayment()` anotado `@Transactional`.
- [ ] `PaymentService.java` implementado.
- [ ] `InsufficientStockException.java` creado.
- [ ] `@ControllerAdvice` creado para manejo de excepciones (409 Conflict).
- [ ] `PedidoController.java` implementado con endpoints CRUD.
- [ ] `PaymentController.java` implementado con endpoints create/commit/status/webhook.
- [ ] `AuthController.java` actualizado con `/me` y `/refresh`.
- [ ] `RefreshToken.java` creado (modelo).
- [ ] `RefreshTokenService.java` creado.
- [ ] Todos los `Repository` creados (Pedido, Payment, DetallePedido, RefreshToken).

### Tests

- [ ] `PaymentIntegrationTest.java` escrito y pasando.
- [ ] `PedidoControllerIntegrationTest.java` escrito y pasando.
- [ ] `RefreshTokenIntegrationTest.java` escrito y pasando.
- [ ] Tests existentes aún pasan (Auth, Producto).
- [ ] `.\mvnw test` retorna `BUILD SUCCESS` con 0 fallos.

### Compilación y Ejecución

- [ ] `.\mvnw clean compile` → `BUILD SUCCESS`.
- [ ] `.\mvnw test` → `BUILD SUCCESS` (todos los tests).
- [ ] `.\mvnw spring-boot:run` → Aplicación inicia sin errores.
- [ ] Swagger UI accesible en http://localhost:8080/swagger-ui.html.
- [ ] Todos los endpoints documentados en Swagger.

### Documentación

- [ ] `INFORME_EVALUACION_DSY1104.md` completado.
- [ ] `DOCUMENTO_INTEGRACION.md` completado con ejemplos cURL/Postman.
- [ ] `MANUAL_USUARIO.md` completado con pantallazos/descripciones.
- [ ] `HELP.md` completado.
- [ ] README.md actualizado (si existe).
- [ ] Comentarios/Javadoc en código crítico (servicios, controladores).

### Entregables Finales

- [ ] Proyecto backend comprimido (ZIP).
- [ ] Proyecto frontend comprimido (ZIP) — si existe.
- [ ] Enlace GitHub público (backend) — si aplica.
- [ ] Enlace GitHub público (frontend) — si aplica.
- [ ] Archivo `backend-0.0.1-SNAPSHOT.jar` generado (`.\mvnw clean package -DskipTests`).

### Presentación Individual (Cada Estudiante)

- [ ] Explicación de backend (2-3 min).
- [ ] Explicación de endpoints REST (2-3 min).
- [ ] Justificación de integración frontend-backend (2-3 min).
- [ ] Descripción de JWT (2-3 min).
- [ ] Exposición de sesiones frontend (2-3 min).
- [ ] Explicación de restricciones de acceso (2-3 min).
- [ ] Demostración en vivo (opcional, 3-5 min).
- [ ] Preparado para responder preguntas técnicas.

---

## ESTIMACIÓN DE HORAS

| Tarea | Responsable | Horas Est. | Horas Reales |
|-------|---|---|---|
| 1.1 Endpoint /me | [ ] | 0.5 | [ ] |
| 1.2 Endpoint /refresh | [ ] | 3 | [ ] |
| 1.3 Modelos Pedido/DetallePedido | [ ] | 2 | [ ] |
| 1.4 Modelo Payment | [ ] | 1 | [ ] |
| 1.5 Campo stock en Producto | [ ] | 0.5 | [ ] |
| 1.6 PedidoService | [ ] | 2 | [ ] |
| 1.7 PaymentService | [ ] | 2 | [ ] |
| 1.8 InsufficientStockException | [ ] | 0.5 | [ ] |
| 1.9 Controladores (Pedido/Payment) | [ ] | 3 | [ ] |
| 1.10 Tests de integración | [ ] | 3 | [ ] |
| 3.1-3.4 Validaciones | [ ] | 1 | [ ] |
| 4.1-4.7 Preparación presentación | Cada miembro | 5 | [ ] |
| **TOTAL** | **—** | **~24-26 horas** | **—** |

**Recomendación**: Distribuir tareas entre los 2-3 miembros del equipo. Si equipo tiene 3 miembros, dedicar 8-9 horas por persona.

---

## PRÓXIMOS PASOS (ORDEN DE EJECUCIÓN)

1. **Hoy/Mañana**: Asignar tareas (quién hace qué) y crear ramas en Git.
2. **Día 1-2**: Completar tareas 1.1-1.5 (endpoints y modelos base).
3. **Día 2-3**: Completar tareas 1.6-1.8 (servicios y excepciones).
4. **Día 3-4**: Completar tareas 1.9-1.10 (controladores y tests).
5. **Día 4-5**: Compilar, ejecutar, validar (tarea 3.1-3.4).
6. **Día 5-6**: Preparar presentación (tarea 4.1-4.7).
7. **Día 7**: Revisar, ajustar últimos detalles, generar JAR final.
8. **Presentación**: Día 7 o día 8 (según horario de clase).

---

## CONTACTO Y COORDINACIÓN

**Espacio de Comunicación**: [Slack/WhatsApp/Teams del equipo]

**Reuniones Recomendadas**:
- Standup diario (15 min): ¿Qué hiciste? ¿Qué vas a hacer? ¿Blockers?
- Code review (30 min): Revisar PRs antes de mergear a main.
- Ensayo presentación (30 min): Día antes de presentar.

---

**Checklist v1.0 — DSY1104 Evaluación Parcial N°3**

Éxito equipo! 🚀

