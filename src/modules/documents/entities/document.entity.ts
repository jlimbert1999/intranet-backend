import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DocumentSection } from './document-section.entity';
import { DocumentCategory } from './document.category.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @ManyToOne(() => DocumentCategory, (category) => category.documents)
  category: DocumentCategory;

  @ManyToOne(() => DocumentSection, (section) => section.documents)
  section: DocumentSection | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
