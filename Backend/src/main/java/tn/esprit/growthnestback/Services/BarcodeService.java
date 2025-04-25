package tn.esprit.growthnestback.Services;

import org.krysalis.barcode4j.impl.code128.Code128Bean;
import org.krysalis.barcode4j.output.bitmap.BitmapCanvasProvider;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class BarcodeService {

    private static final String UPLOAD_DIR = "uploads/products/";

    public String generateBarcode(String productId) throws IOException {
        // Ensure upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate barcode using Code128
        Code128Bean barcodeBean = new Code128Bean();
        barcodeBean.setModuleWidth(0.2);
        barcodeBean.setBarHeight(10.0);
        barcodeBean.doQuietZone(true);

        String barcodeValue = "PROD-" + productId; // Unique barcode value
        String filePath = UPLOAD_DIR + "barcode_" + productId + ".png";

        // Generate barcode image
        try (FileOutputStream out = new FileOutputStream(filePath)) {
            BitmapCanvasProvider canvas = new BitmapCanvasProvider(
                    out, "image/png", 300, BufferedImage.TYPE_BYTE_GRAY, false, 0);
            barcodeBean.generateBarcode(canvas, barcodeValue);
            canvas.finish();
        }

        return filePath;
    }
}