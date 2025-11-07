import { FileValidator } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { lookup as mimeLookup } from 'mime-types';

interface ValidatorConfig {
  validTypes: string[];
}
export class CustomFileTypeValidator extends FileValidator {
  private readonly allowedMimes: string[];

  constructor(config: ValidatorConfig) {
    super(config);
    this.allowedMimes = config.validTypes.map((type) =>  type.includes('/') ? type : mimeLookup(type) || type);
  }

  async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (!file) return false;

    const detected = await fileTypeFromBuffer(file.buffer);

    if (!detected) return false;
    
    console.log(this.allowedMimes);
    console.log(detected.mime);

    return this.allowedMimes.includes(detected.mime);
  }

  buildErrorMessage(file: Express.Multer.File): string {
    // console.log("eror con",file);
    return `File "${file.originalname}" is not valid.`;
  }
}
