package com.oddok.server.common.jwt;

import com.oddok.server.common.errors.TokenValidFailedException;
import com.oddok.server.domain.user.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Component
public class AuthTokenProvider {

    @Value("${jwt.access-token.expire-length}")
    private String accessTokenExpiry;
    @Value("${jwt.refresh-token.expire-length}")
    private String refreshTokenExpiry;

    private final Key key;
    private static final String AUTHORITIES_KEY = "role";

    public AuthTokenProvider(@Value("${jwt.token.secret}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public AuthToken createToken(String id, Role roleType, String expiry) {
        Date expiryDate = getExpiryDate(expiry);
        return new AuthToken(id, roleType, expiryDate, key);
    }

    public AuthToken createUserAccessToken(String id) {
        return createToken(id, Role.USER, accessTokenExpiry);
    }

    public AuthToken createUserRefreshToken(String id) {
        return createToken(id, Role.USER, refreshTokenExpiry);
    }

    public AuthToken convertAuthToken(String token) {
        return new AuthToken(token, key);
    }

    public static Date getExpiryDate(String expiry) {
        return new Date(System.currentTimeMillis() + Long.parseLong(expiry));
    }

    public Authentication getAuthentication(AuthToken authToken) {

        if(authToken.validate()) {
            Claims claims = authToken.getTokenClaims();
            Collection<? extends GrantedAuthority> authorities =
                    Arrays.stream(new String[]{claims.get(AUTHORITIES_KEY).toString()})
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

            User principal = new User(claims.getSubject(), "", authorities);

            return new UsernamePasswordAuthenticationToken(principal, authToken, authorities);
        } else {
            throw new TokenValidFailedException();
        }
    }

    public boolean isValidToken(String token) {
        try {
            AuthToken authToken = convertAuthToken(token);
            return authToken.validate();
        } catch (ExpiredJwtException exception) {
            log.info("Token Expired UserID : " + exception.getClaims().getSubject());
            return false;
        } catch (JwtException exception) {
            log.info("Token Tampered");
            return false;
        } catch (NullPointerException exception) {
            log.info("Token is null");
            return false;
        }
    }
}