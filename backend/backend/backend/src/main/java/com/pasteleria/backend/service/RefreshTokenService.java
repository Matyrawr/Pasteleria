package com.pasteleria.backend.service;

import com.pasteleria.backend.model.RefreshToken;
import com.pasteleria.backend.model.Usuario;
import com.pasteleria.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${app.refreshTokenExpirationMs:604800000}") // 7 days
    private Long refreshTokenExpirationMs;

    public RefreshToken createRefreshToken(Usuario usuario) {
        // Delete existing refresh token for this user
        refreshTokenRepository.deleteByUsuario(usuario);

        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(refreshTokenExpirationMs);

        RefreshToken refreshToken = new RefreshToken(usuario, token, expiryDate);
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public void deleteByUsuario(Usuario usuario) {
        refreshTokenRepository.deleteByUsuario(usuario);
    }
}
