package com.pasteleria.backend.controller;

import com.pasteleria.backend.model.AuthenticationRequest;
import com.pasteleria.backend.model.RegisterRequest;
import com.pasteleria.backend.model.RefreshToken;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.service.JwtService;
import com.pasteleria.backend.service.RefreshTokenService;
import com.pasteleria.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UsuarioService usuarioService, AuthenticationManager authManager, JwtService jwtService, UserDetailsService userDetailsService, RefreshTokenService refreshTokenService) {
        this.usuarioService = usuarioService;
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        Usuario nuevo = usuarioService.register(request);
        UserDetails ud = userDetailsService.loadUserByUsername(nuevo.getUsername());
        String token = jwtService.generateToken(ud);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(nuevo);
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", token);
        response.put("refreshToken", refreshToken.getToken());
        response.put("username", nuevo.getUsername());
        response.put("type", "Bearer");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            UserDetails ud = userDetailsService.loadUserByUsername(request.getUsername());
            Usuario usuario = usuarioService.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            String token = jwtService.generateToken(ud);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(usuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", token);
            response.put("refreshToken", refreshToken.getToken());
            response.put("username", ud.getUsername());
            response.put("type", "Bearer");
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        String username = authentication.getName();
        Usuario usuario = usuarioService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", usuario.getId());
        response.put("username", usuario.getUsername());
        response.put("roles", usuario.getRoles());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String refreshTokenStr = body.get("refreshToken");
        if (refreshTokenStr == null || refreshTokenStr.isEmpty()) {
            return ResponseEntity.status(400).body("Refresh token es requerido");
        }

        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElse(null);

        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token inválido");
        }

        refreshToken = refreshTokenService.verifyExpiration(refreshToken);
        Usuario usuario = refreshToken.getUsuario();
        UserDetails ud = userDetailsService.loadUserByUsername(usuario.getUsername());
        String newAccessToken = jwtService.generateToken(ud);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("refreshToken", refreshTokenStr);
        response.put("username", ud.getUsername());
        response.put("type", "Bearer");

        return ResponseEntity.ok(response);
    }
}
