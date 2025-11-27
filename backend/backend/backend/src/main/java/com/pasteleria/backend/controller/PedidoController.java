package com.pasteleria.backend.controller;

import com.pasteleria.backend.model.Pedido;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.service.PedidoService;
import com.pasteleria.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin("*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Pedido> crearPedido(@RequestBody Map<String, Object> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Usuario usuario = usuarioService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        @SuppressWarnings("unchecked")
        Map<String, Integer> itemsMap = (Map<String, Integer>) body.get("items");
        
        // Convert String keys to Long
        Map<Long, Integer> items = new HashMap<>();
        for (Map.Entry<String, Integer> entry : itemsMap.entrySet()) {
            try {
                items.put(Long.parseLong(entry.getKey()), entry.getValue());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        Pedido pedido = pedidoService.crearPedido(usuario, items);

        return ResponseEntity.status(201).body(pedido);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Pedido>> listarPedidosUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Usuario usuario = usuarioService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Pedido> pedidos = pedidoService.listarPedidosUsuario(usuario);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.getPedidoById(id);
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pedido> actualizarPedido(@PathVariable Long id, @RequestBody Pedido pedido) {
        Pedido actualizado = pedidoService.updatePedido(id, pedido);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }
}
