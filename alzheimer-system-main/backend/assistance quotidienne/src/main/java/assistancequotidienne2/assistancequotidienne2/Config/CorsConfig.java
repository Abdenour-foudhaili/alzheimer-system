package assistancequotidienne2.assistancequotidienne2.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class CorsConfig {

    // Sécurité HTTP désactivée pour cet environnement (pas de JWT obligatoire).
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .anyRequest().permitAll();  // Allow all requests without authentication
        return http.build();
    }
    
    /* ORIGINAL CODE (with OAuth2):
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/ws/**").permitAll()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/api/users/login", "/api/users/register").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2ResourceServer()
                .jwt();
    }
    */
}
