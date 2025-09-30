import {
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  Entity,
  Column,
} from 'typeorm';
import { Document } from './document.entity';

@Entity('document_categories')
export class DocumentCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Document, (document) => document.category)
  documents: Document[];

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    this.name = this.name.replace(/\s+/g, ' ').trim().toUpperCase();
  }
}
