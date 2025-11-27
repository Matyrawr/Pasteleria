# MANUAL DE USUARIO — Tienda Online de Pastelería

**Versión**: 1.0  
**Fecha**: 27 de noviembre de 2024  
**Asignatura**: DSY1104 - Desarrollo Fullstack II  

---

## TABLA DE CONTENIDOS
1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [Guías de Usuario](#guías-de-usuario)
6. [Preguntas Frecuentes](#preguntas-frecuentes)
7. [Solución de Problemas](#solución-de-problemas)

---

## INTRODUCCIÓN

Bienvenido a la **Tienda Online de Pastelería**, una aplicación web moderna que permite a los usuarios:
- 📝 **Registrarse** en la plataforma.
- 🔐 **Iniciar sesión** de forma segura.
- 🍰 **Explorar** productos disponibles (tartas, pasteles, postres).
- 🛒 **Crear pedidos** personalizados.
- 💳 **Procesar pagos** de forma segura.
- 📦 **Seguimiento** de pedidos.

**Nota**: Este manual cubre tanto funcionalidades de usuario final (frontend) como referencia técnica (backend). Para detalles técnicos completos, ver `DOCUMENTO_INTEGRACION.md`.

---

## REQUISITOS DEL SISTEMA

### Para Usuarios Finales (Clientes)
- Navegador web moderno:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- Conexión a Internet (mínimo 1 Mbps).
- JavaScript habilitado.

### Para Administradores
- Mismo requisito que usuarios finales.
- Acceso a credenciales de administrador.

### Para Desarrolladores
- **Sistema Operativo**: Windows 10/11, macOS 11+, Linux (Ubuntu 20.04+).
- **Java**: JDK 17 o superior.
- **Maven**: 3.6.0 o superior.
- **Git**: Para clonar el repositorio.
- **IDE** (opcional): IntelliJ IDEA, VS Code, Eclipse.

---

## INSTALACIÓN Y CONFIGURACIÓN

### Opción 1: Usuarios Finales (Usando la Aplicación Desplegada)

Si la aplicación ya está en línea:

1. Abrir navegador.
2. Ir a `https://tienda-pasteleria.com` (URL del servidor).
3. ¡Listo! Ya puede registrarse y comenzar.

---

### Opción 2: Desarrolladores (Configuración Local)

#### Paso 1: Clonar el Repositorio
```powershell
git clone https://github.com/seusuario/pasteleria-backend.git
cd pasteleria-backend/backend
```

#### Paso 2: Compilar el Backend
```powershell
.\mvnw clean compile
```

**Esperado**: `BUILD SUCCESS`

#### Paso 3: Ejecutar Tests (Opcional)
```powershell
.\mvnw test
```

#### Paso 4: Ejecutar la Aplicación
```powershell
.\mvnw spring-boot:run
```

**Esperado**: Mensaje similar a:
```
Tomcat started on port(s): 8080 (http) with context path ''
Started PasteleriaBackendApplication in X seconds
```

#### Paso 5: Verificar Aplicación
1. Abrir navegador.
2. Ir a `http://localhost:8080/swagger-ui.html`.
3. Debe verse la documentación interactiva de la API.

---

## FUNCIONALIDADES PRINCIPALES

### 1️⃣ Registro de Usuario

**¿Quién puede usar?**: Cualquier persona sin cuenta.

**Pasos**:
1. Ir a página de "Registro" o "Crear Cuenta".
2. Ingresar:
   - **Usuario**: nombre único (ej: `juan_perez`).
   - **Contraseña**: al menos 8 caracteres, mezcla de mayúsculas, minúsculas, números (recomendado).
3. Hacer clic en **"Registrarse"**.
4. Si es exitoso, será redirigido al login.
5. Si hay error (usuario ya existe), se muestra mensaje de error.

**Pantalla esperada**:
```
┌─────────────────────────────────┐
│   CREAR CUENTA                  │
├─────────────────────────────────┤
│ Usuario: [              ]        │
│ Contraseña: [          ]        │
│ Confirmar Contraseña: [       ]  │
│                                  │
│    [ Registrarse ]  [ Cancelar ] │
└─────────────────────────────────┘
```

---

### 2️⃣ Inicio de Sesión (Login)

**¿Quién puede usar?**: Usuarios registrados.

**Pasos**:
1. Ir a página de "Iniciar Sesión" o "Login".
2. Ingresar:
   - **Usuario**: el nombre que registró.
   - **Contraseña**: su contraseña.
3. Hacer clic en **"Iniciar Sesión"**.
4. Si es exitoso:
   - Se muestra mensaje "Bienvenido, [usuario]".
   - Es redirigido al dashboard.
   - El token JWT se almacena automáticamente en el navegador.
5. Si hay error (credenciales incorrectas), se muestra "Usuario o contraseña inválidos".

**Pantalla esperada**:
```
┌─────────────────────────────────┐
│   INICIAR SESIÓN                │
├─────────────────────────────────┤
│ Usuario: [              ]        │
│ Contraseña: [          ]        │
│ [ ] Recuérdame                  │
│                                  │
│    [ Iniciar Sesión ]  [ Olv. ] │
│                                  │
│    ¿No tienes cuenta?           │
│    [ Crear cuenta ]             │
└─────────────────────────────────┘
```

---

### 3️⃣ Explorar Productos

**¿Quién puede usar?**: Usuarios autenticados.

**Pasos**:
1. Hacer clic en "Productos" o "Catálogo" en el menú principal.
2. Se muestra lista de productos disponibles con:
   - Imagen del producto.
   - Nombre.
   - Descripción breve.
   - Precio.
   - Stock disponible (ej: "10 disponibles").
3. Hacer clic en un producto para ver detalles completos.

**Pantalla esperada**:
```
┌──────────────────────────────────────────────────┐
│ CATÁLOGO DE PRODUCTOS                            │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 🍰       │  │ 🎂       │  │ 🧁       │       │
│  │ Tarta    │  │ Pastel   │  │ Cupcakes │       │
│  │ Choc.    │  │ Vanilla  │  │ Fresas   │       │
│  │ $25.50   │  │ $15.00   │  │ $12.00   │       │
│  │ En stock │  │ En stock │  │ En stock │       │
│  │ [+Carrito]  │ [+Carrito]  │ [+Carrito]     │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

### 4️⃣ Crear Pedido

**¿Quién puede usar?**: Usuarios autenticados con productos en el carrito.

**Pasos**:
1. Desde el catálogo, hacer clic en **"+ Agregar al carrito"** para cada producto.
2. El producto se añade al carrito (visible en icono 🛒 en la esquina).
3. Hacer clic en el icono del carrito (🛒).
4. Se muestra resumen del carrito:
   - Productos seleccionados.
   - Cantidad de cada uno.
   - Subtotal por producto.
   - **Total a pagar**.
5. Hacer clic en **"Proceder al pago"** o **"Confirmar Pedido"**.
6. Se crea el pedido en el backend (estado: `CREATED`).
7. Frontend muestra confirmación con **número de pedido** (ej: `Pedido #1234`).

**Pantalla esperada (Carrito)**:
```
┌──────────────────────────────────────┐
│ CARRITO (3 artículos)               │
├──────────────────────────────────────┤
│                                       │
│ Producto              Cant. Subtotal  │
│ ─────────────────────────────────────│
│ Tarta Chocolate       x2   $51.00    │
│ Pastel Vainilla       x1   $15.00    │
│ Cupcakes Fresas       x5   $60.00    │
│                                       │
│ ─────────────────────────────────────│
│ TOTAL:                      $126.00   │
│                                       │
│ [ Vaciar Carrito ]  [ Pagar ]        │
│                                       │
└──────────────────────────────────────┘
```

---

### 5️⃣ Procesar Pago

**¿Quién puede usar?**: Usuarios con pedido creado.

**Pasos**:
1. Desde la confirmación del pedido, hacer clic en **"Proceder al Pago"**.
2. Se muestra formulario de pago con:
   - Número de pedido.
   - Total a pagar.
   - Opción de método de pago (tarjeta de crédito, PayPal, etc. — según configuración).
3. Ingresar detalles de pago (tarjeta, datos personales, etc.).
4. Hacer clic en **"Confirmar Pago"**.
5. **Backend procesa el pago**:
   - Valida que hay stock suficiente.
   - Si OK: marca pedido como `CONFIRMED`, decrementa stock, envía confirmación.
   - Si falta stock: muestra error `"Stock insuficiente"` (código 409).
6. Si es exitoso:
   - Se muestra confirmación: `"¡Pago completado!"`.
   - Se envía email de confirmación al usuario.
   - Pedido pasa a estado `CONFIRMED`.
7. Si hay error:
   - Se muestra mensaje descriptivo.
   - Pedido sigue en estado `CREATED` (no se cobra).
   - Usuario puede reintentar.

**Pantalla esperada (Pago)**:
```
┌──────────────────────────────────────┐
│ CONFIRMAR PAGO                       │
├──────────────────────────────────────┤
│ Pedido #1234                         │
│ Total: $126.00                       │
│ ─────────────────────────────────────│
│                                       │
│ Método de Pago:                      │
│ (●) Tarjeta de Crédito               │
│ ( ) PayPal                           │
│                                       │
│ Datos de la Tarjeta:                 │
│ Número: [________________]           │
│ Vencimiento: [__/__]                 │
│ CVV: [___]                           │
│ Nombre: [________________]           │
│                                       │
│ [ Confirmar Pago ]  [ Cancelar ]    │
│                                       │
└──────────────────────────────────────┘
```

**Pantalla después de pago exitoso**:
```
┌──────────────────────────────────────┐
│ ✅ ¡PAGO COMPLETADO!                 │
├──────────────────────────────────────┤
│                                       │
│ Pedido #1234 confirmado.            │
│ Total pagado: $126.00                │
│                                       │
│ Se ha enviado confirmación a:        │
│ usuario@example.com                  │
│                                       │
│ [ Ver Pedido ]  [ Continuar Shop. ]  │
│                                       │
└──────────────────────────────────────┘
```

---

### 6️⃣ Ver Mis Pedidos

**¿Quién puede usar?**: Usuarios autenticados.

**Pasos**:
1. Ir a "Mi Cuenta" → "Mis Pedidos".
2. Se muestra lista de todos los pedidos del usuario con:
   - **Número de pedido**.
   - **Fecha de creación**.
   - **Estado** (`CREATED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
   - **Total**.
   - **Acciones** (ver detalles, cancelar si aún no se ha pagado).
3. Hacer clic en un pedido para ver detalles:
   - Productos en el pedido (con cantidades y precios).
   - Dirección de envío.
   - Historial de cambios de estado.

**Pantalla esperada**:
```
┌──────────────────────────────────────────┐
│ MIS PEDIDOS                              │
├──────────────────────────────────────────┤
│                                           │
│ Pedido #1234 │ 27 Nov 2024 │ CONFIRMED  │
│ Total: $126.00                            │
│ [Ver Detalles]  [Rastrear]               │
│                                           │
│ ─────────────────────────────────────────│
│                                           │
│ Pedido #1235 │ 26 Nov 2024 │ CREATED    │
│ Total: $50.00                             │
│ [Ver Detalles]  [Cancelar]               │
│                                           │
└──────────────────────────────────────────┘
```

---

### 7️⃣ Panel de Administrador

**¿Quién puede usar?**: Solo usuarios con rol `ADMIN`.

**Funcionalidades**:

#### 7.1 Gestionar Productos
- **Crear**: Añadir nuevo producto (nombre, descripción, precio, stock).
- **Editar**: Modificar producto existente.
- **Eliminar**: Remover producto del catálogo.
- **Ver stock**: Monitor stock disponible.

**Pantalla esperada**:
```
┌──────────────────────────────────────────┐
│ GESTIONAR PRODUCTOS                      │
├──────────────────────────────────────────┤
│ [+ Nuevo Producto]                       │
│                                           │
│ Producto          Precio  Stock  Acciones│
│ ─────────────────────────────────────────│
│ Tarta Chocolate   $25.50  10    [Edit][X]│
│ Pastel Vainilla   $15.00  20    [Edit][X]│
│ Cupcakes Fresas   $12.00  5     [Edit][X]│
│                                           │
└──────────────────────────────────────────┘
```

#### 7.2 Ver Pedidos (Todos)
- Listar todos los pedidos (no solo propios).
- Filtrar por estado, fecha, usuario.
- Cambiar estado de pedido (ej: CREATED → CONFIRMED → SHIPPED → DELIVERED).

#### 7.3 Reportes
- Ventas por período.
- Productos más vendidos.
- Ingresos totales.

---

## GUÍAS DE USUARIO

### ⚡ Guía Rápida: Comprar un Producto

1. **Registrarse**: Ir a "Crear Cuenta", llenar formulario, click "Registrarse".
2. **Iniciar sesión**: Usar credenciales de registro.
3. **Explorar**: Click "Catálogo" o "Productos".
4. **Agregar al carrito**: Click "+ Agregar al carrito" en producto deseado.
5. **Proceder al pago**: Click icono carrito (🛒), click "Pagar".
6. **Completar pago**: Ingresar datos de tarjeta, click "Confirmar Pago".
7. **Confirmación**: Recibirá email de confirmación.

---

### 🔒 Guía de Seguridad: Proteger su Cuenta

1. **Contraseña fuerte**:
   - Mínimo 8 caracteres.
   - Combinar mayúsculas, minúsculas, números, símbolos.
   - No usar información personal (nombre, fecha de nacimiento).
   - Cambiar cada 3 meses.

2. **Token JWT**:
   - El navegador almacena automáticamente un "token" (identificador).
   - NO comparta este token.
   - Si sospecha que fue comprometido, cierre sesión inmediatamente.

3. **Logout**:
   - Siempre haga clic en "Cerrar Sesión" al terminar.
   - En navegadores compartidos, limpie cookies/caché después.

4. **HTTPS**:
   - Asegúrese de que la URL comienza con `https://` (no `http://`).
   - Esto encripta la comunicación con el servidor.

---

### 📱 Guía Móvil: Usar en Smartphone

La aplicación está optimizada para dispositivos móviles:
- El diseño se adapta automáticamente.
- Todos los botones son táctiles.
- Funciona en modo offline (parcialmente, con caché).

**Recomendación**: Usar Chrome, Firefox o Safari más recientes para mejor experiencia.

---

## PREGUNTAS FRECUENTES

### ❓ P1: ¿Olvidé mi contraseña, qué hago?

**R**: Actualmente, no hay función de recuperación de contraseña. Por favor:
1. Contacte al administrador del sitio.
2. Proporcione su usuario y email.
3. Se le enviará una contraseña temporal.

*(Mejora futura: implementar envío de link de reseteo por email)*

---

### ❓ P2: ¿Cuánto tiempo tarda la entrega?

**R**: El tiempo de entrega depende del servicio logístico. Generalmente:
- **Entrega estándar**: 3-5 días hábiles.
- **Entrega express**: 1-2 días hábiles.

Se confirma en el pedido.

---

### ❓ P3: ¿Puedo cancelar un pedido?

**R**: Sí, si aún no ha sido confirmado (estado `CREATED`):
1. Ir a "Mis Pedidos".
2. Hacer clic en el pedido.
3. Click "Cancelar".
4. Confirmar cancelación.

Una vez confirmado (pagado), se puede solicitar devolución al administrador.

---

### ❓ P4: ¿Es seguro ingresar datos de tarjeta?

**R**: Sí:
- La comunicación es encriptada (HTTPS).
- Los datos de tarjeta se procesan a través de un proveedor de pago seguro.
- Nunca almacenamos datos completos de tarjeta en nuestros servidores.

---

### ❓ P5: ¿Cuáles son los métodos de pago?

**R**: Actualmente se acepta:
- Tarjeta de crédito (Visa, Mastercard, Amex).
- PayPal (si configurado).

*(Mejora futura: transferencia bancaria, billeteras digitales)*

---

## SOLUCIÓN DE PROBLEMAS

### ❌ Problema 1: "Usuario o contraseña inválidos"

**Causas posibles**:
- Nombre de usuario o contraseña incorrectos.
- Bloqueado por múltiples intentos fallidos.

**Soluciones**:
1. Verificar que escribe el usuario y contraseña correctos (distingue mayúsculas).
2. Reintentar después de 5 minutos.
3. Si persiste, contactar al administrador.

---

### ❌ Problema 2: "Stock insuficiente"

**Causa**: Intentó comprar más unidades de las disponibles.

**Soluciones**:
1. Reducir la cantidad en el carrito.
2. Esperar a que el administrador reabastezca stock.
3. Contactar al administrador para pre-orden.

---

### ❌ Problema 3: "Error al procesar pago (código 409)"

**Causa**: Stock se agotó entre el momento de crear el pedido y confirmar el pago (compra concurrente).

**Soluciones**:
1. Reducir cantidad en el pedido.
2. Reintentar el pago.
3. Si sigue fallando, seleccionar un producto alternativo.

---

### ❌ Problema 4: "Página no carga o blanca"

**Causas posibles**:
- Conexión a Internet interrumpida.
- Navegador desactualizado.
- JavaScript deshabilitado.

**Soluciones**:
1. Verificar conexión a Internet.
2. Actualizar navegador (Chrome/Firefox/Safari).
3. Habilitar JavaScript (Configuración → Privacidad → JavaScript).
4. Limpiar caché: Ctrl+Shift+Del (Chrome), Cmd+Shift+Del (Mac).
5. Intentar en navegador diferente.

---

### ❌ Problema 5: "Token expirado, vuelva a iniciar sesión"

**Causa**: Token JWT expiró (después de 24 horas sin actividad).

**Soluciones**:
1. Hacer clic en "Volver a iniciar sesión".
2. Ingresar credenciales nuevamente.
3. Será redirigido a donde estaba.

---

### ❌ Problema 6: "No puedo crear cuenta (usuario ya existe)"

**Causa**: El nombre de usuario ya fue registrado.

**Soluciones**:
1. Intentar con otro nombre de usuario (ej: `juan_perez_2`).
2. Si es su usuario, hacer clic en "¿Olvidaste tu contraseña?" para recuperar.
3. Contactar administrador si sospecha de uso fraudulento.

---

## CONTACTO Y SOPORTE

**¿Tiene preguntas o problemas?**

- **Email**: soporte@tienda-pasteleria.com
- **Chat en vivo**: Disponible de lunes a viernes, 9 AM - 6 PM.
- **Teléfono**: +34 91 123 4567
- **Ticket de soporte**: https://soporte.tienda-pasteleria.com

---

## REFERENCIAS Y RECURSOS

- [Documento de Integración Técnica](./DOCUMENTO_INTEGRACION.md) — Para desarrolladores.
- [HELP.md](./HELP.md) — Instrucciones técnicas de compilación.
- [Términos de Servicio](./TERMINOS.md)
- [Política de Privacidad](./PRIVACIDAD.md)

---

**Manual de Usuario v1.0 — DSY1104 Desarrollo Fullstack II**

Última actualización: 27 de noviembre de 2024

