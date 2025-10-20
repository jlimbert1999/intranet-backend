import { pdfToPng } from 'pdf-to-png-converter';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function generatePdfThumbnail(pdfPath: string): Promise<string | null> {
  try {
    const outputDir = path.dirname(pdfPath);
    const fileName = path.basename(pdfPath, '.pdf');
    const outputPath = path.join(outputDir, `${fileName}-preview.png`);

    // Generar la miniatura
    const images = await pdfToPng(pdfPath, {
      pagesToProcess: [1], // solo la primera página
      viewportScale: 0.7, // tamaño de salida (ajusta entre 0.5 y 1.0)
      outputFolder: outputDir,
    });

    // Guardar la imagen (por defecto devuelve el buffer)
    await fs.writeFile(outputPath, images[0].content);

    return outputPath;
  } catch (err) {
    throw new Error(`Error generating PDF thumbnail: ${err}`);
  }
}
