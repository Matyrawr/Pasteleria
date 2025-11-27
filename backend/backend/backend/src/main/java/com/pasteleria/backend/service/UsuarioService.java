package com.pasteleria.backend.service;

import com.pasteleria.backend.model.RegisterRequest;
import com.pasteleria.backend.model.Rol;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.repository.RolRepository;
import com.pasteleria.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    public Usuario register(RegisterRequest dto) {
        if (existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Usuario ya existe");
        }

        Usuario u = new Usuario();
        u.setUsername(dto.getUsername());
        u.setPassword(passwordEncoder.encode(dto.getPassword()));

        // por defecto se asigna ROLE_USER
        Rol rolUser = rolRepository.findByNombre("ROLE_USER").orElseThrow(() -> new RuntimeException("ROLE_USER no existe"));
        HashSet<Rol> roles = new HashSet<>();
        roles.add(rolUser);
        u.setRoles(roles);

        return usuarioRepository.save(u);
    }
}
