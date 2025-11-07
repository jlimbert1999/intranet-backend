import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export async function generateVideoThumbnail(videoPath: string, outputDir: string, filename?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(videoPath)) {
      return reject(new Error('El archivo de video no existe.'));
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const baseName = filename || path.basename(videoPath, path.extname(videoPath));
    const outputFile = path.join(outputDir, `${baseName}-thumb.jpg`);

    // ffmpeg -ss 00:00:02 -i input.mp4 -frames:v 1 -vf "scale=640:-1" output.jpg
    const command = `ffmpeg -y -ss 2 -i "${videoPath}" -frames:v 1 -vf "scale=640:-1" "${outputFile}"`;

    exec(command, (error) => {
      if (error) {
        console.warn('⚠️  No se pudo generar la miniatura:', error.message);
        return reject(error);
      }
      resolve(outputFile);
    });
  });
}
