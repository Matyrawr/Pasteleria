package com.pasteleria.backend.repository;

import com.pasteleria.backend.model.RefreshToken;
import com.pasteleria.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUsuario(Usuario usuario);
    void deleteByUsuario(Usuario usuario);
}
