package tn.esprit.growthnestback.Services;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;

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
                // Set font and size for title
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.beginText();
                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("EVENT INVITATION");
                contentStream.endText();

                // Set font and size for content
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.beginText();
                contentStream.newLineAtOffset(100, 650);
                contentStream.showText("Dear Guest,");
                contentStream.newLineAtOffset(0, -30);
                contentStream.showText("You are cordially invited to attend:");
                contentStream.newLineAtOffset(0, -30);

                // Event title
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.showText(event.getTitle());
                contentStream.setFont(PDType1Font.HELVETICA, 12);

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