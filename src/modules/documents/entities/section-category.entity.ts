import {
  Unique,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentSection } from './document-section.entity';
import { DocumentCategory } from './document.category.entity';
import { Document } from './document.entity';

@Entity('section_category')
@Unique(['section', 'category'])
export class SectionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocumentSection, (section) => section.sectionCategories)
  section: DocumentSection;

  @ManyToOne(() => DocumentCategory, (category) => category.sectionCategories)
  category: DocumentCategory;

  @OneToMany(() => Document, (doc) => doc.sectionCategory)
  documents: Document[];
}
