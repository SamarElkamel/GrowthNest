package tn.esprit.growthnestback.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Chemin de base pour tous les uploads
    private static final String UPLOADS_BASE_DIR = "uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configuration pour les logos
        Path logosDir = Paths.get(UPLOADS_BASE_DIR + "logos").toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/logos/**")
                .addResourceLocations("file:" + logosDir + "/")
                .setCachePeriod(3600);

        // Configuration pour les PDFs
        Path pdfsDir = Paths.get(UPLOADS_BASE_DIR + "pdfs").toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/pdfs/**")
                .addResourceLocations("file:" + pdfsDir + "/")
                .setCachePeriod(3600);

        // Configuration pour les produits
        Path productsDir = Paths.get(UPLOADS_BASE_DIR + "products").toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:" + productsDir + "/")
                .setCachePeriod(3600);

        // Debug
        System.out.println("Configuration des ressources :");
        System.out.println("Logos: " + logosDir);
        System.out.println("PDFs: " + pdfsDir);
        System.out.println("Products: " + productsDir);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
