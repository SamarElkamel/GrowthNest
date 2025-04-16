package tn.esprit.growthnestback.Services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import lombok.RequiredArgsConstructor;
import tn.esprit.growthnestback.Entities.*;
import tn.esprit.growthnestback.Repository.ReclamationRepository;
import org.springframework.stereotype.Service;

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

        // Grouper par type et statut
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

        // Style
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 10);

        // Titre
        Paragraph title = new Paragraph("Rapport des Réclamations", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20f);
        document.add(title);

        // Date de génération
        Paragraph date = new Paragraph("Généré le: " + new SimpleDateFormat("dd/MM/yyyy HH:mm").format(new Date()));
        date.setAlignment(Element.ALIGN_RIGHT);
        date.setSpacingAfter(20f);
        document.add(date);

        // Tableau des statistiques
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        // En-têtes du tableau
        addTableHeader(table, "Type de Réclamation", headerFont, BaseColor.GRAY);
        addTableHeader(table, "Statut", headerFont, BaseColor.GRAY);
        addTableHeader(table, "Nombre", headerFont, BaseColor.GRAY);

        // Remplir le tableau
        stats.forEach((type, statusMap) -> {
            statusMap.forEach((status, count) -> {
                table.addCell(createCell(String.valueOf(type), bodyFont));
                table.addCell(createCell(String.valueOf(status), bodyFont));
                table.addCell(createCell(String.valueOf(count), bodyFont));
            });
        });

        document.add(table);

        // Ajouter un espace
        document.add(new Paragraph(" "));

        // Tableau des détails
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
        Paragraph detailsTitle = new Paragraph("Détails des Réclamations", headerFont);
        detailsTitle.setSpacingBefore(20f);
        detailsTitle.setSpacingAfter(10f);
        document.add(detailsTitle);

        PdfPTable detailsTable = new PdfPTable(4);
        detailsTable.setWidthPercentage(100);

        // En-têtes
        addTableHeader(detailsTable, "ID", headerFont, BaseColor.GRAY);
        addTableHeader(detailsTable, "Type", headerFont, BaseColor.GRAY);
        addTableHeader(detailsTable, "Statut", headerFont, BaseColor.GRAY);
        addTableHeader(detailsTable, "Date", headerFont, BaseColor.GRAY);

        // Données
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        reclamations.forEach(reclamation -> {
            detailsTable.addCell(createCell(reclamation.getReclamationId().toString(), bodyFont));
            detailsTable.addCell(createCell(String.valueOf(reclamation.getType()), bodyFont));
            detailsTable.addCell(createCell(String.valueOf(reclamation.getStatus()), bodyFont));
            detailsTable.addCell(createCell(dateFormat.format(reclamation.getReclamationDate()), bodyFont));
        });

        document.add(detailsTable);
    }
}