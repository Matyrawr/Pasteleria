package com.pasteleria.backend.repository;

import com.pasteleria.backend.model.Payment;
import com.pasteleria.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTxId(String txId);
    Optional<Payment> findByPedido(Pedido pedido);
}
