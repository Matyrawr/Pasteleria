# HELP.md — Guía Técnica de Compilación, Ejecución y Desarrollo

**Versión**: 1.0  
**Fecha**: 27 de noviembre de 2024  
**Proyecto**: Backend Pastelería (Spring Boot)  

---

## TABLA DE CONTENIDOS
1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación Rápida](#instalación-rápida)
4. [Compilación](#compilación)
5. [Ejecución](#ejecución)
6. [Tests](#tests)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Configuración](#configuración)
9. [Desarrollo](#desarrollo)
10. [Despliegue](#despliegue)
11. [Solución de Problemas](#solución-de-problemas)

---

## INTRODUCCIÓN

Este proyecto es un **backend REST API** desarrollado con **Spring Boot 3.5.8** para una aplicación de e-commerce de pastelería. Incluye:
- Autenticación y autorización con JWT.
- CRUD de productos con control de stock.
- Gestión de pedidos y detalles de pedidos.
- Integración de pagos (pendiente de implementación completa).
- Tests de integración.
- Documentación Swagger/OpenAPI.

### Stack Tecnológico
- **Framework**: Spring Boot 3.5.8
- **Lenguaje**: Java 17
- **Build Tool**: Maven 3.6+
- **BD**: H2 (desarrollo), MySQL 8.0+ (producción)
- **Autenticación**: Spring Security + JWT (jjwt 0.11.5)
- **API Docs**: SpringDoc OpenAPI 2.2.0
- **Testing**: JUnit 5, Mockito, Spring Test

---

## REQUISITOS PREVIOS

### Windows 10/11
1. **Java Development Kit (JDK) 17+**
   ```powershell
   # Descargar desde: https://www.oracle.com/java/technologies/downloads/
   # O usar scoop/chocolatey:
   choco install openjdk17
   # Verificar
   java -version
   ```

2. **Maven 3.6+**
   ```powershell
   # Descargar desde: https://maven.apache.org/download.cgi
   # O usar scoop/chocolatey:
   choco install maven
   # Verificar
   mvn -version
   ```

3. **Git** (para clonar repositorio)
   ```powershell
   choco install git
   git --version
   ```

### macOS
```bash
# Usar Homebrew
brew install openjdk@17
brew install maven
brew install git

# Verificar
java -version
mvn -version
git --version
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install openjdk-17-jdk maven git

# Verificar
java -version
mvn -version
git --version
```

---

## INSTALACIÓN RÁPIDA

### 1. Clonar Repositorio
```powershell
git clone https://github.com/seusuario/pasteleria-backend.git
cd pasteleria-backend/backend
```

### 2. Compilar
```powershell
.\mvnw clean compile
```

**Esperado**: 
```
BUILD SUCCESS
```

### 3. Ejecutar Tests
```powershell
.\mvnw test
```

**Esperado**:
```
Tests run: X, Failures: 0, Skipped: 0
BUILD SUCCESS
```

### 4. Ejecutar Aplicación
```powershell
.\mvnw spring-boot:run
```

**Esperado**:
```
Started PasteleriaBackendApplication in X.XXX seconds
```

### 5. Acceder a la Aplicación
- **API**: http://localhost:8080/api/...
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

---

## COMPILACIÓN

### Comando Principal
```powershell
.\mvnw clean compile
```

**Fases de Maven**:
- `clean` — Elimina el directorio `target/`.
- `compile` — Compila código fuente Java.

### Compilar con Logs Verbosos
```powershell
.\mvnw -X clean compile
```

### Saltar Tests
```powershell
.\mvnw clean compile -DskipTests
```

### Compilar Construcción Final (JAR)
```powershell
.\mvnw clean package
```

**Genera**: `target/backend-0.0.1-SNAPSHOT.jar`

---

## EJECUCIÓN

### Opción 1: Maven Plugin (Spring Boot)
```powershell
.\mvnw spring-boot:run
```

**Ventajas**: Automático, integrado con IDE.  
**Desventajas**: Más lento para cambios de código.

### Opción 2: JAR Compilado
```powershell
# Primero compilar
.\mvnw clean package

# Luego ejecutar
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Ventajas**: Rápido después de compilación inicial.  
**Desventajas**: Requiere compilación explícita ante cambios.

### Opción 3: IDE (IntelliJ IDEA / VS Code)

**IntelliJ IDEA**:
1. Abrir proyecto → `backend` folder.
2. Click derecho en `PasteleriaBackendApplication.java`.
3. Click "Run 'PasteleriaBackendApplication'".

**VS Code**:
1. Instalar extension "Extension Pack for Java".
2. Abrir `PasteleriaBackendApplication.java`.
3. Click "Run" (arriba del método `main()`).

### Configuración en Runtime

**Variables de entorno**:
```powershell
# Windows PowerShell
$env:JWT_SECRET = "MiSecretoBase64MasLargo=="
$env:JWT_EXPIRATION_MS = "86400000"
$env:SPRING_DATASOURCE_URL = "jdbc:h2:mem:pasteleria"

.\mvnw spring-boot:run
```

**Propiedades en línea de comando**:
```powershell
.\mvnw spring-boot:run -Dspring-boot.run.arguments="--jwt.secret=MiSecretoBase64 --server.port=9090"
```

---

## TESTS

### Ejecutar Todos los Tests
```powershell
.\mvnw test
```

### Ejecutar Test Específico
```powershell
# Por nombre de clase
.\mvnw -Dtest=AuthControllerIntegrationTest test

# Por nombre de método
.\mvnw -Dtest=AuthControllerIntegrationTest#loginWithExistingUserReturnsToken test

# Coincidencia wildcard
.\mvnw -Dtest=*IntegrationTest test
```

### Tests Disponibles (Línea de Base)
- `AuthControllerIntegrationTest` — Login/registro.
- `ProductoControllerIntegrationTest` — CRUD productos.
- `PasteleriaBackendApplicationTests` — Tests básicos de contexto.

### Tests a Implementar (Pendientes)
- `PedidoControllerIntegrationTest` — CRUD pedidos.
- `PaymentIntegrationTest` — Create/commit pago, casos stock.
- `RefreshTokenIntegrationTest` — Refresh token endpoint.

### Ver Cobertura de Código
```powershell
.\mvnw clean test jacoco:report

# Abrir reporte
start target/site/jacoco/index.html
```

### Modo Watch (Re-ejecutar tests al cambiar código)
```powershell
.\mvnw test -Dorg.apache.maven.plugins:maven-surefire-plugin:watch
```

---

## ESTRUCTURA DEL PROYECTO

```
backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/pasteleria/backend/
│   │   │   ├── PasteleriaBackendApplication.java       # Punto de entrada
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java                 # Configuración Spring Security
│   │   │   │   └── DataInitializer.java                # Inicialización de datos
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java                 # Endpoints autenticación
│   │   │   │   ├── ProductoController.java             # Endpoints productos
│   │   │   │   ├── PedidoController.java               # Endpoints pedidos (pendiente)
│   │   │   │   └── PaymentController.java              # Endpoints pagos (pendiente)
│   │   │   ├── model/
│   │   │   │   ├── Usuario.java                        # Entidad usuario
│   │   │   │   ├── Rol.java                            # Entidad rol
│   │   │   │   ├── Producto.java                       # Entidad producto
│   │   │   │   ├── Pedido.java                         # Entidad pedido (pendiente)
│   │   │   │   ├── DetallePedido.java                  # Entidad detalle (pendiente)
│   │   │   │   ├── Payment.java                        # Entidad pago (pendiente)
│   │   │   │   └── *Request.java, *Response.java       # DTOs
│   │   │   ├── repository/
│   │   │   │   ├── UsuarioRepository.java
│   │   │   │   ├── RolRepository.java
│   │   │   │   ├── ProductoRepository.java
│   │   │   │   ├── PedidoRepository.java               # (pendiente)
│   │   │   │   ├── DetallePedidoRepository.java        # (pendiente)
│   │   │   │   └── PaymentRepository.java              # (pendiente)
│   │   │   ├── service/
│   │   │   │   ├── UsuarioService.java
│   │   │   │   ├── ProductoService.java
│   │   │   │   ├── JwtService.java
│   │   │   │   ├── PedidoService.java                  # (pendiente)
│   │   │   │   └── PaymentService.java                 # (pendiente)
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   └── exception/
│   │   │       └── InsufficientStockException.java    # (pendiente)
│   │   └── resources/
│   │       └── application.properties                  # Configuración Spring
│   │
│   └── test/
│       └── java/com/pasteleria/backend/
│           └── controller/
│               ├── AuthControllerIntegrationTest.java
│               └── ProductoControllerIntegrationTest.java
│
├── pom.xml                                              # Dependencias Maven
├── mvnw                                                 # Maven wrapper (Linux/Mac)
├── mvnw.cmd                                             # Maven wrapper (Windows)
│
├── INFORME_EVALUACION_DSY1104.md                       # Este informe
├── DOCUMENTO_INTEGRACION.md                            # Guía técnica de APIs
├── MANUAL_USUARIO.md                                   # Manual para usuarios finales
├── HELP.md                                              # Este archivo
└── README.md                                            # (opcional) Resumen general

```

---

## CONFIGURACIÓN

### application.properties

```properties
# Base de Datos H2 (desarrollo)
spring.datasource.url=jdbc:h2:mem:pasteleria
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true

# Swagger/OpenAPI
springdoc.api-docs.enabled=true
springdoc.swagger-ui.enabled=true

# JWT
jwt.secret=MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=
jwt.expirationMs=86400000
```

### Cambiar a MySQL (Producción)

1. **Añadir dependencia en `pom.xml`** (ya presente como perfil):
   ```powershell
   .\mvnw clean compile -Pmysql
   ```

2. **Actualizar `application.properties`**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pasteleria_db
   spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
   spring.datasource.username=root
   spring.datasource.password=tuContraseña

   spring.jpa.hibernate.ddl-auto=validate
   ```

3. **Crear base de datos MySQL**:
   ```sql
   CREATE DATABASE pasteleria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

## DESARROLLO

### Hot Reload (Dev Tools)
```powershell
# Instalar (si no está)
# en pom.xml, descomenta:
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>

# Compilar
.\mvnw clean compile

# Ejecutar
.\mvnw spring-boot:run
```

Ahora, al cambiar código, Spring Boot reinicia automáticamente.

### Debugger

**En VS Code**:
1. Instalar "Debugger for Java" extension.
2. Click "Run → Start Debugging".
3. Seleccionar "Java".
4. Seleccionar `PasteleriaBackendApplication`.

**En IntelliJ IDEA**:
1. Click derecho en `PasteleriaBackendApplication`.
2. Click "Debug 'PasteleriaBackendApplication'".

### Plugins Recomendados

**IntelliJ IDEA**:
- Lombok Plugin (para anotaciones @Getter, @Setter).

**VS Code**:
- Extension Pack for Java.
- Spring Boot Extension Pack.
- REST Client (para probar APIs localmente).

---

## DESPLIEGUE

### Generar JAR para Producción
```powershell
.\mvnw clean package -DskipTests
```

**Resultado**: `target/backend-0.0.1-SNAPSHOT.jar` (empaquetado, listo para desplegar).

### Ejecutar JAR en Producción
```powershell
java -Xmx512m -Xms256m \
  -Dspring.profiles.active=prod \
  -Dserver.port=8080 \
  -jar backend-0.0.1-SNAPSHOT.jar
```

**Parámetros**:
- `-Xmx512m` — Memoria máxima JVM (512 MB).
- `-Xms256m` — Memoria inicial JVM (256 MB).
- `-Dspring.profiles.active=prod` — Perfil de aplicación.
- `-Dserver.port=8080` — Puerto HTTP.

### Docker (Opcional)

**Crear `Dockerfile`**:
```dockerfile
FROM openjdk:17-slim

WORKDIR /app
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

**Crear imagen**:
```powershell
docker build -t pasteleria-backend:1.0 .
```

**Ejecutar contenedor**:
```powershell
docker run -p 8080:8080 pasteleria-backend:1.0
```

---

## SOLUCIÓN DE PROBLEMAS

### ❌ Error: "No valid JDK found"
```
Error: Unable to find a valid JDK
```

**Solución**:
```powershell
# Verificar JDK instalado
java -version

# Si no está instalado, descargar desde https://www.oracle.com/java/

# Si está instalado, configurar en Maven:
set JAVA_HOME=C:\Program Files\Java\jdk-17

# Verificar nuevamente
.\mvnw -version
```

---

### ❌ Error: "Port 8080 is already in use"
```
Port 8080 is already in use
```

**Soluciones**:
```powershell
# Opción 1: Cambiar puerto
.\mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"

# Opción 2: Matar proceso en puerto 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Opción 2b: Matar proceso en puerto 8080 (Mac/Linux)
lsof -i :8080
kill -9 <PID>
```

---

### ❌ Error: "Maven not found"
```
'mvn' is not recognized
```

**Solución**:
```powershell
# Descargar Maven: https://maven.apache.org/download.cgi
# Extraer a C:\maven

# Configurar PATH:
$env:PATH += ";C:\maven\bin"

# Verificar
mvn -version
```

---

### ❌ Error: "Tests fail with 'Pedido class not found'"
```
Cannot find symbol: class Pedido
```

**Solución**:
- Crear archivo `Pedido.java` en `src/main/java/com/pasteleria/backend/model/`.
- Ver sección [Estructura del Proyecto](#estructura-del-proyecto) para ubicación.

---

### ❌ Error: "Cannot open H2 console"
```
http://localhost:8080/h2-console → 404 Not Found
```

**Solución**:
1. Verificar en `application.properties`:
   ```properties
   spring.h2.console.enabled=true
   ```
2. Reiniciar aplicación.
3. Acceder a http://localhost:8080/h2-console.
4. En el login H2:
   - **JDBC URL**: `jdbc:h2:mem:pasteleria`
   - **User Name**: `sa`
   - **Password**: (dejar en blanco)

---

### ❌ Error: "Token validation fails"
```
JWT token invalid or expired
```

**Causas**:
1. Token expirado (24 horas).
2. Secreto JWT no coincide entre generación y validación.

**Soluciones**:
1. Volver a loguearse para obtener nuevo token.
2. Verificar `jwt.secret` en `application.properties` (debe ser idéntico en generación y validación).

---

## REFERENCIAS

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Maven Documentation](https://maven.apache.org/)
- [JWT.io](https://jwt.io/)
- [OpenAPI/Swagger](https://swagger.io/)
- [H2 Database](https://www.h2database.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**HELP.md v1.0 — DSY1104 Desarrollo Fullstack II**

Última actualización: 27 de noviembre de 2024

