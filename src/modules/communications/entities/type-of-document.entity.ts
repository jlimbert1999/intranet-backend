import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Communication } from './communication.entity';

@Entity('type_of_documents')//-> nombre de la tabla

@Unique(['name'])
export class TypeOfDocument {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @OneToMany(() => Communication, (c) => c.typeOfDocument)
    communications: Communication[];
}
