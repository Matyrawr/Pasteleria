package com.pasteleria.backend.config;

import com.pasteleria.backend.model.Rol;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.repository.RolRepository;
import com.pasteleria.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RolRepository rolRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Crear roles si no existen
        Rol user = rolRepository.findByNombre("ROLE_USER").orElseGet(() -> rolRepository.save(new Rol(null, "ROLE_USER")));
        Rol admin = rolRepository.findByNombre("ROLE_ADMIN").orElseGet(() -> rolRepository.save(new Rol(null, "ROLE_ADMIN")));

        // Crear usuario admin por defecto si no existe
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario u = new Usuario();
            u.setUsername("admin");
            u.setPassword(passwordEncoder.encode("admin"));
            HashSet<Rol> roles = new HashSet<>();
            roles.add(admin);
            u.setRoles(roles);
            usuarioRepository.save(u);
        }
    }
}
