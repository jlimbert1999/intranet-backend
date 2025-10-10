import {
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  Entity,
  Column,
} from 'typeorm';
import { SectionCategory } from './section-category.entity';

@Entity('document_categories')
export class DocumentCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => SectionCategory, (sc) => sc.category)
  sectionCategories: SectionCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    this.name = this.name.replace(/\s+/g, ' ').trim().toUpperCase();
  }

}
