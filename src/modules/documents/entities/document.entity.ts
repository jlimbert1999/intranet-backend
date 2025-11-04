import { Column, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SectionCategory } from './section-category.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column({ type: 'int', default: new Date().getFullYear() })
  fiscalYear: number;

  @Column()
  sizeBytes: number;

  @Column({ default: 0 })
  downloadCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SectionCategory, (sc) => sc.documents)
  sectionCategory: SectionCategory;
}
