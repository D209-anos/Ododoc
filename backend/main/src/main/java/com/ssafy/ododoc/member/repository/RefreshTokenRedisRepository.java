package com.ssafy.ododoc.member.repository;

import com.ssafy.ododoc.member.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RefreshTokenRedisRepository extends CrudRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
