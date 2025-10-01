import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { TypeOfDocument } from './type-of-document.entity';

@Entity('communications')//-> nombre de la tabla
export class Communication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TypeOfDocument, (tod) => tod.communications, { nullable: false, onDelete: 'RESTRICT' })
    typeOfDocument: TypeOfDocument;

    @Index()
    @Column({ type: 'int' })
    area_id: number;

    @Index()
    @Column({ type: 'varchar', length: 80 })
    number_document: string;

    @Index()
    @Column({ type: 'date' })
    publication_date: string;
}
