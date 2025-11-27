package com.pasteleria.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String txId;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    private Double amount;
    private String currency;
    private String estado; // CREATED, COMMITTED, FAILED
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public Payment() {}

    public Payment(String txId, Pedido pedido, Double amount, String currency) {
        this.txId = txId;
        this.pedido = pedido;
        this.amount = amount;
        this.currency = currency;
        this.estado = "CREATED";
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTxId() { return txId; }
    public void setTxId(String txId) { this.txId = txId; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
