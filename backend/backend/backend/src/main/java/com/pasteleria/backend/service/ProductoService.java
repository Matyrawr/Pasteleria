package com.pasteleria.backend.service;

import com.pasteleria.backend.model.Producto;
import com.pasteleria.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) {
        this.repo = repo;
    }

    public List<Producto> listar() {
        return repo.findAll();
    }

    public Producto guardar(Producto p) {
        return repo.save(p);
    }

    public Producto buscar(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Producto actualizar(Long id, Producto p) {
        Producto existe = buscar(id);
        if (existe != null) {
            existe.setNombre(p.getNombre());
            existe.setDescripcion(p.getDescripcion());
            existe.setPrecio(p.getPrecio());
            return repo.save(existe);
        }
        return null;
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}
