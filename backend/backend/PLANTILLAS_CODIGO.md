# PLANTILLAS DE CÓDIGO — Implementaciones Rápidas

Este archivo contiene **snippets listos para copiar/pegar** para las tareas críticas. Usa estos como base y adapta según tu contexto.

---

## 1. IMPLEMENTAR ENDPOINT /auth/me

### Paso 1: Crear DTO UsuarioDTO.java

```java
package com.pasteleria.backend.model;

import java.util.Set;

public class UsuarioDTO {
    private Long id;
    private String username;
    private Set<Rol> roles;

    public UsuarioDTO() {}

    public UsuarioDTO(Long id, String username, Set<Rol> roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.username = usuario.getUsername();
        this.roles = usuario.getRoles();
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Set<Rol> getRoles() { return roles; }
    public void setRoles(Set<Rol> roles) { this.roles = roles; }
}
```

### Paso 2: Actualizar AuthController.java

Añadir este método al final de la clase:

```java
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMe() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            return ResponseEntity.ok(new UsuarioDTO(usuario));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body("Sesión inválida o expirada");
        }
    }
```

### Paso 3: Compilar y Probar

```powershell
.\mvnw clean compile

# Prueba con cURL (Windows PowerShell)
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 2. IMPLEMENTAR REFRESH TOKEN

### Paso 1: Crear Modelo RefreshToken.java

```java
package com.pasteleria.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    public RefreshToken() {}

    public RefreshToken(Usuario usuario, String token, Instant expiryDate) {
        this.usuario = usuario;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Instant getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Instant expiryDate) { this.expiryDate = expiryDate; }
}
```

### Paso 2: Crear RefreshTokenRepository.java

```java
package com.pasteleria.backend.repository;

import com.pasteleria.backend.model.RefreshToken;
import com.pasteleria.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUsuario(Usuario usuario);
    void deleteByUsuario(Usuario usuario);
}
```

### Paso 3: Crear RefreshTokenService.java

```java
package com.pasteleria.backend.service;

import com.pasteleria.backend.model.RefreshToken;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${jwt.refresh.expirationMs:604800000}") // 7 días por defecto
    private long refreshTokenExpirationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UsuarioService usuarioService;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UsuarioService usuarioService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.usuarioService = usuarioService;
    }

    public RefreshToken createRefreshToken(Long usuarioId) {
        Usuario usuario = usuarioService.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Eliminar token anterior si existe
        refreshTokenRepository.findByUsuario(usuario).ifPresent(refreshTokenRepository::delete);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsuario(usuario);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpirationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expirado. Por favor, vuelva a iniciar sesión.");
        }
        return token;
    }

    public void deleteByUsuario(Usuario usuario) {
        refreshTokenRepository.deleteByUsuario(usuario);
    }
}
```

**Nota**: Actualizar `application.properties`:
```properties
jwt.refresh.expirationMs=604800000
```

### Paso 4: Crear DTO RefreshTokenRequest.java

```java
package com.pasteleria.backend.model;

public class RefreshTokenRequest {
    private String refreshToken;

    public RefreshTokenRequest() {}

    public RefreshTokenRequest(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
```

### Paso 5: Actualizar AuthController.java

Modificar métodos `register()` y `login()` para retornar refresh token:

```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    Usuario nuevo = usuarioService.register(request);
    UserDetails ud = userDetailsService.loadUserByUsername(nuevo.getUsername());
    
    String accessToken = jwtService.generateToken(ud);
    RefreshToken refreshToken = refreshTokenService.createRefreshToken(nuevo.getId());
    
    return ResponseEntity.ok(new AuthenticationResponseWithRefresh(
        accessToken, 
        refreshToken.getToken(), 
        nuevo.getUsername()
    ));
}

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
    try {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails ud = userDetailsService.loadUserByUsername(request.getUsername());
        
        String accessToken = jwtService.generateToken(ud);
        Usuario usuario = usuarioService.findByUsername(request.getUsername()).orElseThrow();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(usuario.getId());
        
        return ResponseEntity.ok(new AuthenticationResponseWithRefresh(
            accessToken,
            refreshToken.getToken(),
            ud.getUsername()
        ));
    } catch (AuthenticationException ex) {
        return ResponseEntity.status(401).body("Credenciales inválidas");
    }
}

@PostMapping("/refresh")
public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {
    try {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken())
            .orElseThrow(() -> new RuntimeException("Refresh token no encontrado"));
        
        refreshTokenService.verifyExpiration(refreshToken);
        
        Usuario usuario = refreshToken.getUsuario();
        UserDetails ud = userDetailsService.loadUserByUsername(usuario.getUsername());
        String newAccessToken = jwtService.generateToken(ud);
        
        return ResponseEntity.ok(new AuthenticationResponseWithRefresh(
            newAccessToken,
            request.getRefreshToken(),
            usuario.getUsername()
        ));
    } catch (Exception ex) {
        return ResponseEntity.status(401).body("Error al renovar token: " + ex.getMessage());
    }
}
```

### Paso 6: Crear DTO AuthenticationResponseWithRefresh.java

```java
package com.pasteleria.backend.model;

public class AuthenticationResponseWithRefresh {
    private String token;
    private String refreshToken;
    private String username;

    public AuthenticationResponseWithRefresh(String token, String refreshToken, String username) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.username = username;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
```

### Paso 7: Actualizar UsuarioService.java

Añadir método `findById()`:

```java
public Optional<Usuario> findById(Long id) {
    return usuarioRepository.findById(id);
}
```

---

## 3. CREAR MODELO PEDIDO

```java
package com.pasteleria.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String estado; // CREATED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    private Double total;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private Set<DetallePedido> detalles = new HashSet<>();

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public Pedido() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = "CREATED";
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Set<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(Set<DetallePedido> detalles) { this.detalles = detalles; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
```

---

## 4. CREAR MODELO DETALLE PEDIDO

```java
package com.pasteleria.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_pedidos")
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private Integer cantidad;
    private Double precioUnitario;

    public DetallePedido() {}

    public DetallePedido(Pedido pedido, Producto producto, Integer cantidad, Double precioUnitario) {
        this.pedido = pedido;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}
```

---

## 5. CREAR EXCEPCIÓN INSUFFICIENTSTOCKEXCEPTION

```java
package com.pasteleria.backend.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

---

## 6. CREAR GLOBAL EXCEPTION HANDLER

```java
package com.pasteleria.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<?> handleInsufficientStock(InsufficientStockException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", 409);
        error.put("error", "Conflict");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(409).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", 500);
        error.put("error", "Internal Server Error");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(500).body(error);
    }
}
```

---

## 7. TEST PARA ENDPOINT /me

```java
@Test
void getMeReturnsAuthenticatedUserData() throws Exception {
    // Registrar usuario
    Usuario u = new Usuario();
    u.setUsername("testuser");
    u.setPassword(passwordEncoder.encode("pwd123"));
    HashSet<Rol> roles = new HashSet<>();
    roles.add(rolRepository.findByNombre("ROLE_USER").orElseThrow());
    u.setRoles(roles);
    usuarioRepository.save(u);

    // Login para obtener token
    AuthenticationRequest loginReq = new AuthenticationRequest();
    loginReq.setUsername("testuser");
    loginReq.setPassword("pwd123");

    String loginPayload = objectMapper.writeValueAsString(loginReq);
    String loginBody = mvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(loginPayload))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();

    AuthenticationResponse resp = objectMapper.readValue(loginBody, AuthenticationResponse.class);
    String token = resp.getToken();

    // Llamar a /me con token
    String meBody = mvc.perform(get("/api/auth/me")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();

    UsuarioDTO meResp = objectMapper.readValue(meBody, UsuarioDTO.class);
    assertThat(meResp.getUsername()).isEqualTo("testuser");
    assertThat(meResp.getRoles()).isNotEmpty();
}
```

---

## COMPILAR Y PROBAR

```powershell
# Compilar
.\mvnw clean compile

# Tests
.\mvnw test

# Ejecutar
.\mvnw spring-boot:run

# Probar /me con cURL
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -H "Authorization: Bearer $token" http://localhost:8080/api/auth/me
```

---

**Plantillas v1.0 — DSY1104**

Usa estos snippets como punto de partida. Adapta según tu contexto y mejora según sea necesario.

