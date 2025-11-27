package com.pasteleria.backend.service;

import com.pasteleria.backend.exception.InsufficientStockException;
import com.pasteleria.backend.exception.ResourceNotFoundException;
import com.pasteleria.backend.model.DetallePedido;
import com.pasteleria.backend.model.Pedido;
import com.pasteleria.backend.model.Producto;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.repository.PedidoRepository;
import com.pasteleria.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public Pedido crearPedido(Usuario usuario, Map<Long, Integer> items) {
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEstado("CREATED");
        pedido.setFechaCreacion(LocalDateTime.now());
        pedido.setFechaActualizacion(LocalDateTime.now());

        Double total = 0.0;
        for (Map.Entry<Long, Integer> entry : items.entrySet()) {
            Long productoId = entry.getKey();
            Integer cantidad = entry.getValue();

            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + productoId));

            if (producto.getStock() < cantidad) {
                throw new InsufficientStockException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(cantidad);
            detalle.setPrecioUnitario(producto.getPrecio());

            pedido.getDetalles().add(detalle);
            total += producto.getPrecio() * cantidad;
        }

        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }

    public Pedido confirmOrderFromPayment(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + pedidoId));

        // Reduce stock for all items in the order
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();
            Integer newStock = producto.getStock() - detalle.getCantidad();
            if (newStock < 0) {
                throw new InsufficientStockException("Stock insuficiente para confirmar el pedido");
            }
            producto.setStock(newStock);
            productoRepository.save(producto);
        }

        pedido.setEstado("CONFIRMED");
        pedido.setFechaActualizacion(LocalDateTime.now());
        return pedidoRepository.save(pedido);
    }

    public Pedido getPedidoById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + id));
    }

    public List<Pedido> listarPedidosUsuario(Usuario usuario) {
        return pedidoRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

    public Pedido updatePedido(Long id, Pedido pedido) {
        Pedido existente = getPedidoById(id);
        existente.setEstado(pedido.getEstado());
        existente.setTotal(pedido.getTotal());
        existente.setFechaActualizacion(LocalDateTime.now());
        return pedidoRepository.save(existente);
    }

    public void deletePedido(Long id) {
        Pedido pedido = getPedidoById(id);
        pedidoRepository.delete(pedido);
    }
}
