import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InstanceType } from '../instance-types/entities/instance-type.entity';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  instancia: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion?: string | null;

  @Column({ type: 'bigint', nullable: true })
  jefe?: number | null;

  @Column({ type: 'bigint', nullable: true })
  soporte?: number | null;

  @Column({ type: 'bigint', nullable: true })
  secretaria?: number | null;

  @Column({ type: 'bigint', name: 'telefono_fijo', nullable: true })
  telefonoFijo?: number | null;

  @ManyToOne(() => InstanceType, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'instance_type_id' })
  instanceType?: InstanceType | null;

  @Column({ name: 'instance_type_id', type: 'uuid', nullable: true })
  instanceTypeId?: string | null;
}
