package tn.esprit.growthnestback.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;
import tn.esprit.growthnestback.Services.JwtService;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Service
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        if (request.getServletPath().contains("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the Authorization header
        final String authHeader = request.getHeader(AUTHORIZATION);
        String jwt = null;
        String userEmail = null;

        // Check if the header is present and starts with "Bearer"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);  // Extract JWT token
            userEmail = jwtService.extractUsername(jwt);  // Extract the username (email) from JWT
        }

        // If we have a valid JWT and user email
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            // Check if the token is valid
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Create the Authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // No credentials (password) in JWT
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("ROLE SET >>> " + userDetails.getAuthorities());
                System.out.println("USER >>> " + userDetails.getUsername());

            }
        }

        // Proceed with the filter chain
        filterChain.doFilter(request, response);

        // LOGS - Optional for debugging
        System.out.println("Auth Header: " + authHeader);
        System.out.println("JWT: " + jwt);
        System.out.println("Extracted Username: " + userEmail);
    }
}
