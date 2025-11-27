package com.pasteleria.backend.controller;

import com.pasteleria.backend.model.Payment;
import com.pasteleria.backend.model.Pedido;
import com.pasteleria.backend.service.PaymentService;
import com.pasteleria.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> crearPago(@RequestBody Map<String, Long> body) {
        Long pedidoId = body.get("pedidoId");
        Pedido pedido = pedidoService.getPedidoById(pedidoId);
        Payment payment = paymentService.crearPago(pedido);
        return ResponseEntity.status(201).body(payment);
    }

    @PostMapping("/commit/{txId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> confirmarPago(@PathVariable String txId) {
        Payment payment = paymentService.confirmarPago(txId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/status/{txId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> obtenerEstadoPago(@PathVariable String txId) {
        Payment payment = paymentService.obtenerEstadoPago(txId);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> procesarWebhook(@RequestBody Map<String, String> body) {
        String txId = body.get("txId");
        String estado = body.get("estado");
        paymentService.procesarWebhook(txId, estado);
        return ResponseEntity.noContent().build();
    }
}
