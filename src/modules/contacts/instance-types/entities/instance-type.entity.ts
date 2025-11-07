import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Contact } from '../../entities/contact.entity';

@Entity('instance_types')
export class InstanceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @OneToMany(() => Contact, (contact) => contact.instanceType)
  contacts: Contact[];
}
