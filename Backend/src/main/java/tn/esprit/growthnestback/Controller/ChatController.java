package tn.esprit.growthnestback.Controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String OLLAMA_URL = "http://localhost:11434/api/generate";

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody String userMessage) {
        System.out.println("🔵 Received user message: " + userMessage);

        // Filter based on topic
        if (!isAllowedTopic(userMessage)) {
            System.out.println("🛑 Message rejected: Not related to allowed topics.");
            return ResponseEntity.badRequest().body("Only questions related to business, finance, or marketing are allowed.");
        }

        // Construct payload
        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3.1:latest");
        body.put("prompt", buildPrompt(userMessage));
        body.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        System.out.println("🟡 Sending payload to Ollama: " + body);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(OLLAMA_URL, entity, Map.class);

            System.out.println("🟢 Ollama raw response: " + response.getBody());

            String reply = (String) response.getBody().get("response");
            System.out.println("✅ Final extracted reply: " + reply);

            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            System.out.println("❌ Error talking to LLaMA: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error talking to LLaMA.");
        }
    }

    private boolean isAllowedTopic(String msg) {
        String lower = msg.toLowerCase().trim();

        // Friendly greetings – allowed even if off-topic
        String[] greetings = {
                "hi", "hello", "hey", "good morning", "good afternoon", "how are you", "what's up"
        };
        for (String g : greetings) {
            if (lower.contains(g)) {
                return true;
            }
        }

        // Business-relevant keywords
        return lower.matches(".*\\b(finance|financing|sales|business|marketing|market|strategy|entrepreneur|growth)\\b.*");
    }

    private String buildPrompt(String userMessage) {
        return """
You are GrowthNest, a smart assistant designed to help small business owners with:

- Business strategy
- Marketing campaigns
- Financial planning
- Customer retention
- Growth hacks for startups

Instructions:
- Use simple, clear language
- Answer only relevant questions
- Be brief but informative (max 100 words)
- Use bullet points if applicable
- NEVER make up facts
- If the question is off-topic, politely decline

Question: %s
""".formatted(userMessage);
    }
}
