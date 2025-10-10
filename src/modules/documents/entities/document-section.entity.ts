import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SectionCategory } from './section-category.entity';

@Entity('document_sections')
export class DocumentSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SectionCategory, (sc) => sc.section)
  sectionCategories: SectionCategory[];
}
