package com.pasteleria.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pasteleria.backend.model.AuthenticationRequest;
import com.pasteleria.backend.model.Rol;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.repository.RefreshTokenRepository;
import com.pasteleria.backend.repository.RolRepository;
import com.pasteleria.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        usuarioRepository.deleteAll();
        rolRepository.deleteAll();

        rolRepository.save(new Rol("ROLE_USER"));
        rolRepository.save(new Rol("ROLE_ADMIN"));
    }

    @Test
    void registerCreatesToken() throws Exception {
        AuthenticationRequest req = new AuthenticationRequest();
        req.setUsername("testuser");
        req.setPassword("password");

        final String payload = objectMapper.writeValueAsString(req);

        final String body = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode resp = objectMapper.readTree(body);
        assertThat(resp.get("accessToken").asText()).isNotBlank();
        assertThat(resp.get("refreshToken").asText()).isNotBlank();
        assertThat(resp.get("username").asText()).isEqualTo("testuser");
    }

    @Test
    void loginWithExistingUserReturnsToken() throws Exception {
        // create user first
        Usuario u = new Usuario();
        u.setUsername("loginuser");
        u.setPassword(passwordEncoder.encode("pwd123"));
        HashSet<Rol> roles = new HashSet<>();
        roles.add(rolRepository.findByNombre("ROLE_USER").orElseThrow());
        u.setRoles(roles);
        usuarioRepository.save(u);

        AuthenticationRequest req = new AuthenticationRequest();
        req.setUsername("loginuser");
        req.setPassword("pwd123");

        final String payload = objectMapper.writeValueAsString(req);

        final String body = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode resp = objectMapper.readTree(body);
        assertThat(resp.get("accessToken").asText()).isNotBlank();
        assertThat(resp.get("refreshToken").asText()).isNotBlank();
        assertThat(resp.get("username").asText()).isEqualTo("loginuser");
    }
}
