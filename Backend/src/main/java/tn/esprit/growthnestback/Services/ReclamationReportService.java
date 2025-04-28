package tn.esprit.growthnestback.Services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import lombok.RequiredArgsConstructor;
import tn.esprit.growthnestback.Entities.*;
import tn.esprit.growthnestback.Repository.ReclamationRepository;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReclamationReportService {

    private final ReclamationRepository reclamationRepository;

    public byte[] generateReclamationReport() throws DocumentException {
        List<Reclamation> reclamations = reclamationRepository.findAll();

        // Group by type and status
        Map<ReclamationType, Map<ReclamationStatus, Long>> stats = reclamations.stream()
                .collect(Collectors.groupingBy(
                        Reclamation::getType,
                        Collectors.groupingBy(
                                Reclamation::getStatus,
                                Collectors.counting()
                        )
                ));

        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        // Styles
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 10);

        // Title
        Paragraph title = new Paragraph("Claims Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20f);
        document.add(title);

        // Generation date
        Paragraph date = new Paragraph("Generated on: " + new SimpleDateFormat("MM/dd/yyyy HH:mm").format(new Date()));
        date.setAlignment(Element.ALIGN_RIGHT);
        date.setSpacingAfter(20f);
        document.add(date);

        // Statistics table
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        // Table headers
        addTableHeader(table, "Claim Type", headerFont, BaseColor.GRAY);
        addTableHeader(table, "Status", headerFont, BaseColor.GRAY);
        addTableHeader(table, "Count", headerFont, BaseColor.GRAY);

        // Fill table with data
        stats.forEach((type, statusMap) -> {
            statusMap.forEach((status, count) -> {
                table.addCell(createCell(String.valueOf(type), bodyFont));
                table.addCell(createCell(String.valueOf(status), bodyFont));
                table.addCell(createCell(String.valueOf(count), bodyFont));
            });
        });

        document.add(table);

        // Add spacing
        document.add(new Paragraph(" "));

        // Detailed claims table
        if(!reclamations.isEmpty()) {
            addDetailedReclamations(document, reclamations, headerFont, bodyFont);
        }

        document.close();
        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, String header, Font font, BaseColor bgColor) {
        PdfPCell cell = new PdfPCell(new Phrase(header, font));
        cell.setBackgroundColor(bgColor);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5);
        table.addCell(cell);
    }

    private PdfPCell createCell(String content, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(5);
        return cell;
    }

    private void addDetailedReclamations(Document document, List<Reclamation> reclamations,
                                         Font headerFont, Font bodyFont) throws DocumentException {
        Paragraph detailsTitle = new Paragraph("Claims Details", headerFont);
        detailsTitle.setSpacingBefore(20f);
        detailsTitle.setSpacingAfter(10f);
        document.add(detailsTitle);

        PdfPTable detailsTable = new PdfPTable(4);
        detailsTable.setWidthPercentage(100);

        // Headers
        addTableHeader(detailsTable, "ID", headerFont, BaseColor.GRAY);
        addTableHeader(detailsTable, "Type", headerFont, BaseColor.GRAY);
        addTableHeader(detailsTable, "Status", headerFont, BaseColor.GRAY);
        addTableHeader(detailsTable, "Date", headerFont, BaseColor.GRAY);

        // Data
        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm");
        reclamations.forEach(reclamation -> {
            detailsTable.addCell(createCell(reclamation.getReclamationId().toString(), bodyFont));
            detailsTable.addCell(createCell(String.valueOf(reclamation.getType()), bodyFont));
            detailsTable.addCell(createCell(String.valueOf(reclamation.getStatus()), bodyFont));
            detailsTable.addCell(createCell(dateFormat.format(reclamation.getReclamationDate()), bodyFont));
        });

        document.add(detailsTable);
    }
}