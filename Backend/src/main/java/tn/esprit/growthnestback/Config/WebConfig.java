package tn.esprit.growthnestback.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.mediaType("jpg", MediaType.IMAGE_JPEG);
        configurer.mediaType("jpeg", MediaType.IMAGE_JPEG);
        configurer.mediaType("png", MediaType.IMAGE_PNG);
        configurer.mediaType("gif", MediaType.IMAGE_GIF);
        configurer.mediaType("webp", MediaType.parseMediaType("image/webp"));
        configurer.mediaType("bmp", MediaType.parseMediaType("image/bmp"));
    }
}