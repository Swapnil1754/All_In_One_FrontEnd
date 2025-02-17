package com.example.RegistrationService.Service;

import com.example.RegistrationService.Domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@Service
public class JwtSecurityTokenGeneratorImpl implements JwtSecurityTokenGenerator{
    @Override
    public Map<String, Object> generateToken(User user) {
        String jwtToken = null;
        jwtToken = Jwts.builder().setSubject(user.getEmail()).setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, Base64.getEncoder().encodeToString("secretkey".getBytes())).compact();
        Map<String,Object> map = new HashMap<>();
        map.put("token", jwtToken);
        map.put("message","User Successfully Logged In...!!!");
        map.put("Name", user.getName1());
        map.put("email", user.getEmail());
        map.put("mobNo", user.getMobNo());
        map.put("isOwner", user.isOwner());
        return map;
    }
}
