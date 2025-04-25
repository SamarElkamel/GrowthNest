package tn.esprit.growthnestback.Services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.awt.Color;

@Service
public class PdfExportService {

    public byte[] generateEventInvitationPdf(Registration registration) throws IOException {
        if (registration.getStatus() != ReservationStatus.CONFIRMED) {
            throw new IllegalStateException("Cannot generate invitation for non-confirmed registration");
        }

        Event event = registration.getEvent();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy");

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Load and add logo
                PDImageXObject logo = PDImageXObject.createFromFile("src/main/resources/images/growthNest.jpg", document);
                float logoWidth = 100;
                float logoHeight = 50;
                float pageWidth = page.getMediaBox().getWidth();
                float xLogo = (pageWidth - logoWidth) / 2; // Center horizontally
                contentStream.drawImage(logo, xLogo, 720, logoWidth, logoHeight);

                // Draw background rectangle for content
                contentStream.setNonStrokingColor(new Color(255, 245, 235)); // Light orange background
                contentStream.addRect(50, 100, pageWidth - 100, 600); // Larger background
                contentStream.fill();

                // Draw larger frame (cadre)
                contentStream.setStrokingColor(new Color(255, 204, 153)); // Slightly darker orange frame
                contentStream.setLineWidth(2);
                contentStream.addRect(45, 95, pageWidth - 90, 610); // Larger frame
                contentStream.stroke();

                // Set font and color for title
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.setNonStrokingColor(new Color(255, 165, 0)); // Vibrant orange title
                contentStream.beginText();
                contentStream.newLineAtOffset(100, 650);
                contentStream.showText("EVENT INVITATION");
                contentStream.endText();

                // Set font and color for content
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.setNonStrokingColor(Color.BLACK); // Black for body text
                contentStream.beginText();
                contentStream.newLineAtOffset(100, 600);
                contentStream.showText("Dear Guest,");
                contentStream.newLineAtOffset(0, -30);
                contentStream.showText("You are cordially invited to attend:");
                contentStream.newLineAtOffset(0, -30);

                // Event title
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.setNonStrokingColor(new Color(255, 165, 0)); // Vibrant orange for event title
                contentStream.showText(event.getTitle());
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.setNonStrokingColor(Color.BLACK);

                contentStream.newLineAtOffset(0, -30);
                contentStream.showText("Date: " + dateFormat.format(event.getDate()));
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Time: " + event.getStartTime() + " - " + event.getEndTime());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Location: " + event.getLocation());
                contentStream.newLineAtOffset(0, -40);
                contentStream.showText("We look forward to seeing you there!");
                contentStream.endText();
            }

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        }
    }
}