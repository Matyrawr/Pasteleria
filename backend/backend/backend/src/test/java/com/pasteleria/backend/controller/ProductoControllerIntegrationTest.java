package com.pasteleria.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pasteleria.backend.model.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProductoControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() throws Exception {
        // Ensure DB seeded via API as needed. Tests will assume data is empty initially.
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void listarProductosAllowedForUser() throws Exception {
        mvc.perform(get("/api/productos").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void crearProductoAllowedForAdmin() throws Exception {
        Producto p = new Producto(null, "Torta de chocolate", "Deliciosa", 15000.0);
        String payload = objectMapper.writeValueAsString(p);

        mvc.perform(post("/api/productos").contentType(MediaType.APPLICATION_JSON).content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Torta de chocolate"));
    }
}
