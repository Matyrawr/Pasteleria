# 🍰 Pastelería Backend — Evaluación Parcial N°3 DSY1104

**Asignatura**: Desarrollo Fullstack II  
**Período**: Semestre 2024-2  
**Evaluación**: Parcial N°3 (40% encargo grupal + 60% presentación individual)  
**Fecha de Informe**: 27 de noviembre de 2024  
**Estado**: En desarrollo — Documentación 100%, Código ~70%

---

## 📚 DOCUMENTACIÓN ENTREGADA

Se han generado **6 documentos comprehensivos** (~3000 líneas) para guiar el desarrollo, evaluación y presentación:

| Documento | Tamaño | Propósito |
|-----------|--------|----------|
| 📋 **INFORME_EVALUACION_DSY1104.md** | 28 KB | Análisis detallado vs rúbrica oficial, indicadores, brechas, recomendaciones |
| 🔧 **DOCUMENTO_INTEGRACION.md** | 19 KB | Guía técnica de endpoints REST, flujos, ejemplos cURL/Postman, códigos error |
| 👥 **MANUAL_USUARIO.md** | 21 KB | Guía para usuarios finales: registro, login, compra, pago, FAQs |
| 🚀 **HELP.md** | 16 KB | Instrucciones técnicas: compilar, ejecutar, tests, configuración, troubleshooting |
| ✅ **CHECKLIST_PLAN_ACCION.md** | 21 KB | Tareas concretas con asignación, estimaciones, criterios de aceptación |
| 📋 **PLANTILLAS_CODIGO.md** | 18 KB | Snippets listos para copiar/pegar: /me, refresh token, modelos, tests |
| 📊 **RESUMEN_EJECUTIVO.md** | 8 KB | Vista ejecutiva: estado actual, hoja de ruta, puntos críticos, recomendaciones |

**Total**: 131 KB de documentación (~3000 líneas) — **COMPLETAMENTE GENERADA**.

---

## 🎯 ESTADO ACTUAL DEL PROYECTO

### ✅ Backend Implementado (70%)

**Autenticación y Seguridad**:
- ✅ JWT (generación, validación, expiración).
- ✅ Spring Security con roles USER/ADMIN.
- ✅ Control de acceso granular (@PreAuthorize).
- ✅ Filtro de autenticación JwtAuthenticationFilter.
- ✅ PasswordEncoder (BCrypt).

**Endpoints REST** (10/15 aproximadamente):
- ✅ POST /api/auth/register — registrar usuario.
- ✅ POST /api/auth/login — login.
- ✅ GET /api/productos — listar.
- ✅ POST /api/productos — crear (ADMIN).
- ✅ PUT /api/productos/{id} — actualizar (ADMIN).
- ✅ DELETE /api/productos/{id} — eliminar (ADMIN).
- ❌ GET /api/auth/me — obtener usuario autenticado.
- ❌ POST /api/auth/refresh — renovar token.
- ❌ CRUD de pedidos (POST, GET, PUT, DELETE).
- ❌ CRUD de pagos (create, commit, status, webhook).

**Base de Datos**:
- ✅ Configurada H2 (desarrollo) con auto-migración.
- ✅ Modelos: Usuario, Rol, Producto.
- ❌ Modelos: Pedido, DetallePedido, Payment, RefreshToken.

**Tests**:
- ✅ AuthControllerIntegrationTest (login/registro).
- ✅ ProductoControllerIntegrationTest (CRUD productos).
- ❌ PaymentIntegrationTest (flujo pago).
- ❌ PedidoControllerIntegrationTest (CRUD pedidos).
- ❌ RefreshTokenIntegrationTest (refresh token).

**Documentación**:
- ✅ Swagger/OpenAPI habilitado e integrado.
- ✅ Endpoints auto-documentados en `/swagger-ui.html`.

### ❌ Faltante Crítico (10-14 horas de trabajo)

1. **Endpoint /auth/me** — 30 min (plantilla disponible).
2. **Refresh token** — 2-3 h (plantilla disponible).
3. **Modelos Pedido/DetallePedido/Payment** — 2-3 h.
4. **Servicios PedidoService/PaymentService** — 3-4 h.
5. **Controladores PedidoController/PaymentController** — 2-3 h.
6. **Tests de integración** — 2-3 h.

### 📱 Frontend

Pendiente de validación en presentación. Debe incluir:
- Registro/login con gestión de JWT.
- Exploración de productos.
- Carrito de compras.
- Proceso de pago con integración al backend.
- Panel de usuario (mis pedidos).
- Panel de admin (gestión de productos).

---

## 🚀 CÓMO USAR ESTA DOCUMENTACIÓN

### Para el Equipo (Desarrollo)

1. **Leer RESUMEN_EJECUTIVO.md** (10 min) — Panorama general.
2. **Revisar CHECKLIST_PLAN_ACCION.md** (20 min) — Asignar tareas, estimar horas.
3. **Usar PLANTILLAS_CODIGO.md** (necesario durante desarrollo) — Copiar/pegar snippets.
4. **Compilar y probar** siguiendo HELP.md.
5. **Documentar cambios** en DOCUMENTO_INTEGRACION.md conforme avanzan.

**Prioridad**: Completar tareas 1.1-1.10 (CHECKLIST) en 7 días.

### Para Evaluadores

1. **Leer INFORME_EVALUACION_DSY1104.md** (20 min) — Comprensión de brechas y logros.
2. **Revisar CHECKLIST FINAL** — Validar requisitos cumplidos.
3. **Ejecutar aplicación** siguiendo HELP.md — Compilar y probar.
4. **Verificar Swagger** en `/swagger-ui.html` — Validar endpoints documentados.
5. **Evaluar presentación oral** — Cada estudiante debe explicar su parte.

### Para Usuarios Finales (Post-Despliegue)

1. **Leer MANUAL_USUARIO.md** — Guía paso a paso.
2. **DOCUMENTO_INTEGRACION.md** — Referencias técnicas para desarrolladores frontend.

---

## 📋 CHECKLIST DE ENTREGA (Rúbrica Oficial)

### ✅ Entregables Documentación (100%)

- [x] INFORME_EVALUACION_DSY1104.md — Análisis vs rúbrica.
- [x] DOCUMENTO_INTEGRACION.md — Guía técnica de APIs.
- [x] MANUAL_USUARIO.md — Manual usuario final.
- [x] HELP.md — Instrucciones técnicas.
- [x] CHECKLIST_PLAN_ACCION.md — Plan de trabajo.
- [x] PLANTILLAS_CODIGO.md — Código listo para usar.
- [x] RESUMEN_EJECUTIVO.md — Vista ejecutiva.

### ⚠️ Entregables Código (70%)

- [x] Backend conectado a BD (H2).
- [x] Endpoints AUTH + PRODUCTOS.
- [x] Spring Security con JWT.
- [x] Tests de autenticación y productos.
- [x] Swagger/OpenAPI documentado.
- [ ] Endpoints PEDIDOS (falta).
- [ ] Endpoints PAGOS (falta).
- [ ] Endpoint /me (falta).
- [ ] Endpoint /refresh (falta).
- [ ] Tests de PAGOS (falta).

### ⚠️ Entregables Finales (Rúbrica)

- [ ] Enlace GitHub público (backend).
- [ ] Enlace GitHub público (frontend).
- [ ] Proyecto backend comprimido.
- [ ] Proyecto frontend comprimido.
- [x] Manual de usuario ✅.
- [x] Documento de integración ✅.

---

## 🔧 COMANDOS RÁPIDOS

### Compilar
```powershell
.\mvnw clean compile
```

### Ejecutar Tests
```powershell
.\mvnw test
```

### Ejecutar Aplicación
```powershell
.\mvnw spring-boot:run
# Acceder: http://localhost:8080/swagger-ui.html
```

### Generar JAR
```powershell
.\mvnw clean package -DskipTests
# Resultado: target/backend-0.0.1-SNAPSHOT.jar
```

### Probar Endpoint /me (después de implementar)
```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 📊 INDICADORES DE LOGRO (vs Rúbrica)

### Situación Evaluativa 1: ENCARGO (40%)

| Indicador | Estado Actual | Meta | Esfuerzo |
|-----------|---|---|---|
| IE3.1.1 — Backend + BD + Modelos | 70% | 100% | Crear Pedido/Payment |
| IE3.2.1 — Endpoints REST + Swagger | 70% | 100% | Crear controllers |
| IE3.2.2 — Integración REST | 60% | 100% | Documentación + testing |
| IE3.3.1 — JWT + Roles | 70% | 100% | Refresh token |
| IE3.3.2 — Sesiones frontend | 50% | 100% | /me + /refresh |
| IE3.3.3 — Restricciones acceso | 80% | 100% | Frontend |

**Promedio Actual**: ~66% (Desempeño aceptable)  
**Promedio Meta**: 100% (Muy buen desempeño)

### Situación Evaluativa 2: PRESENTACIÓN (60%)

Cada estudiante debe explicar (individual):
1. Desarrollo backend (2-3 min).
2. Endpoints REST (2-3 min).
3. Integración frontend-backend (2-3 min).
4. JWT y seguridad (2-3 min).
5. Sesiones en frontend (2-3 min).
6. Control de acceso (2-3 min).

**Recursos**: Ver CHECKLIST_PLAN_ACCION.md sección "Tareas 4.1-4.7".

---

## 📞 CONTACTO Y SOPORTE

**¿Preguntas sobre documentación?**
- Revisar el archivo correspondiente.
- Buscar en CHECKLIST_PLAN_ACCION.md.

**¿Errores técnicos?**
- Consultar HELP.md sección "Solución de problemas".
- Revisar PLANTILLAS_CODIGO.md para snippets.

**¿Duda sobre evaluación?**
- Ver INFORME_EVALUACION_DSY1104.md — mapeo completo de indicadores.

---

## 📖 ÍNDICE DE ARCHIVOS

```
backend/
│
├── 📄 README.md (este archivo)
│
├── 📋 Documentación Entregada
│   ├── INFORME_EVALUACION_DSY1104.md — Análisis vs rúbrica, indicadores, brechas
│   ├── DOCUMENTO_INTEGRACION.md — Endpoints, flujos, ejemplos cURL/Postman
│   ├── MANUAL_USUARIO.md — Guía usuario final (registro, compra, pago)
│   ├── HELP.md — Instrucciones técnicas (compilar, ejecutar, deployar)
│   ├── CHECKLIST_PLAN_ACCION.md — Tareas concretas con estimaciones
│   ├── PLANTILLAS_CODIGO.md — Snippets listos para usar
│   └── RESUMEN_EJECUTIVO.md — Vista ejecutiva
│
├── 🔧 Código Fuente
│   ├── pom.xml — Dependencias Maven
│   ├── mvnw, mvnw.cmd — Maven wrapper
│   ├── src/main/java/com/pasteleria/backend/
│   │   ├── PasteleriaBackendApplication.java
│   │   ├── config/ — SecurityConfig, DataInitializer
│   │   ├── controller/ — AuthController, ProductoController, [PedidoController], [PaymentController]
│   │   ├── model/ — Usuario, Rol, Producto, [Pedido], [DetallePedido], [Payment], [RefreshToken]
│   │   ├── repository/ — UsuarioRepository, ProductoRepository, [PedidoRepository], [PaymentRepository]
│   │   ├── service/ — JwtService, UsuarioService, ProductoService, [PedidoService], [PaymentService], [RefreshTokenService]
│   │   ├── security/ — JwtAuthenticationFilter, CustomUserDetailsService
│   │   ├── exception/ — [InsufficientStockException]
│   │   └── resources/
│   │       └── application.properties — Configuración (BD, JWT, Swagger)
│   │
│   ├── src/test/java/com/pasteleria/backend/
│   │   └── controller/
│   │       ├── AuthControllerIntegrationTest.java ✅
│   │       ├── ProductoControllerIntegrationTest.java ✅
│   │       ├── [PaymentIntegrationTest.java]
│   │       ├── [PedidoControllerIntegrationTest.java]
│   │       └── [RefreshTokenIntegrationTest.java]
│   │
│   ├── target/ — Artefactos compilados (ignorar)
│   └── HELP.md (ver raíz)

[  ] = Pendiente de crear
✅ = Ya existe
```

---

## 🎓 NOTAS PEDAGÓGICAS

Este proyecto integra conceptos clave de **Desarrollo Fullstack II (DSY1104)**:

### Arquitectura Multicapa
- **Controller** → Recibe requests HTTP, delega en servicios.
- **Service** → Lógica de negocio, transacciones, validaciones.
- **Repository** → Acceso a datos (JPA/Hibernate).
- **Model** → Entidades y DTOs.

### Seguridad
- **Spring Security** — Framework de autenticación y autorización.
- **JWT** — Tokens sin estado para APIs REST.
- **Roles** — Control de acceso granular (USER vs ADMIN).
- **PasswordEncoder** — Hash de contraseñas (BCrypt).

### Base de Datos
- **H2** — Desarrollo rápido (en memoria).
- **JPA/Hibernate** — ORM (Object-Relational Mapping).
- **Migrations** — Auto-actualización de schema (`ddl-auto=update`).

### Testing
- **Integration Tests** — Validan flujos end-to-end (controller → service → BD).
- **Mockito** — Mock de dependencias en tests unitarios.
- **Spring Test** — Contexto de aplicación en tests.

### API REST
- **HTTP Methods** — GET (lectura), POST (creación), PUT (actualización), DELETE (eliminación).
- **Status Codes** — 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 500 (Error).
- **JSON** — Formato estándar de request/response.
- **OpenAPI/Swagger** — Documentación auto-generada de APIs.

---

## 🏆 EXPECTATIVA DE ÉXITO

Con el seguimiento de este plan:

- ✅ **80-100% de logro** en evaluación parcial N°3.
- ✅ Equipo completamente preparado para presentación.
- ✅ Backend listo para producción (con ajustes menores).
- ✅ Documentación profesional y exhaustiva.

**Clave**: Disciplina en tareas, revisión de código, testing riguroso.

---

## 📝 REGISTRO DE CAMBIOS

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 27-Nov-2024 | Creación inicial: 6 documentos + este README |
| — | — | — |

---

**Proyecto Pastelería Backend — DSY1104 Desarrollo Fullstack II**

**Última actualización**: 27 de noviembre de 2024  
**Documentación generada por**: Sistema de Evaluación Técnica  
**Estado**: Listo para desarrollo

---

## 📞 ¿PREGUNTAS?

Lee los documentos en este orden:

1. **RESUMEN_EJECUTIVO.md** (5 min) — Panorama rápido.
2. **CHECKLIST_PLAN_ACCION.md** (20 min) — Plan de trabajo.
3. **PLANTILLAS_CODIGO.md** (mientras desarrollas) — Snippets.
4. **DOCUMENTO_INTEGRACION.md** (si necesitas detalles técnicos).
5. **HELP.md** (si hay errores técnicos).
6. **INFORME_EVALUACION_DSY1104.md** (para evaluación/presentación).
7. **MANUAL_USUARIO.md** (para usuarios finales).

---

¡Éxito en la evaluación! 🚀

