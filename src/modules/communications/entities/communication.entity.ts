import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
  Unique,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { TypeCommunication } from './type-communication.entity';

@Entity('communications')
@Unique(['code'])
export class Communication {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 160 })
  reference: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  code: string;

  @CreateDateColumn()
  publicationDate: Date;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  previewName?: string;

  @ManyToOne(() => TypeCommunication, (type) => type.communications, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  typeCommunication: TypeCommunication;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    this.code = this.code.replace(/\s+/g, ' ').trim().toUpperCase();
  }
}
