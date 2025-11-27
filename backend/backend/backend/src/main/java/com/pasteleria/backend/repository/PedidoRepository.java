package com.pasteleria.backend.repository;

import com.pasteleria.backend.model.Pedido;
import com.pasteleria.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Usuario usuario);
    List<Pedido> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
}
