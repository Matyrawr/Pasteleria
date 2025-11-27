package com.pasteleria.backend.service;

import com.pasteleria.backend.exception.ResourceNotFoundException;
import com.pasteleria.backend.model.Payment;
import com.pasteleria.backend.model.Pedido;
import com.pasteleria.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PedidoService pedidoService;

    public Payment crearPago(Pedido pedido) {
        String txId = UUID.randomUUID().toString();
        Payment payment = new Payment(txId, pedido, pedido.getTotal(), "CLP");
        return paymentRepository.save(payment);
    }

    public Payment confirmarPago(String txId) {
        Payment payment = paymentRepository.findByTxId(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + txId));

        payment.setEstado("COMMITTED");
        payment.setFechaActualizacion(LocalDateTime.now());

        // Confirm the order from the pedido service
        pedidoService.confirmOrderFromPayment(payment.getPedido().getId());

        return paymentRepository.save(payment);
    }

    public Payment obtenerEstadoPago(String txId) {
        return paymentRepository.findByTxId(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + txId));
    }

    public void procesarWebhook(String txId, String estado) {
        Payment payment = paymentRepository.findByTxId(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado: " + txId));

        if ("committed".equalsIgnoreCase(estado)) {
            payment.setEstado("COMMITTED");
            pedidoService.confirmOrderFromPayment(payment.getPedido().getId());
        } else if ("failed".equalsIgnoreCase(estado)) {
            payment.setEstado("FAILED");
        }

        payment.setFechaActualizacion(LocalDateTime.now());
        paymentRepository.save(payment);
    }
}
