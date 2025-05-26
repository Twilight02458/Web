package com.ltlt.filters;

import com.ltlt.utils.JwtUtils;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtFilter implements Filter {

    private static final List<String> EXCLUDED_PATHS = List.of(
            "/api/login",
            "/api/payment/vnpay-return"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String uri = httpRequest.getRequestURI();
        String ctx = httpRequest.getContextPath();
        String path = uri.substring(ctx.length()); // Lấy path chuẩn

        // Nếu path nằm trong danh sách được loại trừ → bỏ qua filter
        if (EXCLUDED_PATHS.contains(path)) {
            chain.doFilter(request, response);
            return;
        }

        // Còn lại là các API cần xác thực
        if (path.startsWith("/api/")) {
            String header = httpRequest.getHeader("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header.");
                return;
            }

            String token = header.substring(7);
            try {
                String username = JwtUtils.validateTokenAndGetUsername(token);
                String role = JwtUtils.getRoleFromToken(token);

                if (username != null && role != null) {
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    chain.doFilter(request, response);
                    return;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ hoặc hết hạn");
            return;
        }

        // Các request khác không cần JWT
        chain.doFilter(request, response);
    }
}
