import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index, JoinColumn, Unique } from 'typeorm';
import { TypeOfDocument } from './type-of-document.entity';

@Entity('communications')
@Unique(['number_document']) // opcional: único global
export class Communication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TypeOfDocument, (tod) => tod.communications, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'type_of_document_id' })
    typeOfDocument: TypeOfDocument;

    @Index()
    @Column({ type: 'varchar', length: 160 })
    titulo: string;

    @Index()
    @Column({ type: 'varchar', length: 80 })
    number_document: string;

    @Index()
    @Column({ type: 'date' })
    publication_date: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    file: string | null;
    }
