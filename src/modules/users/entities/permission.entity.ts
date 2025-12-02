import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Módulo (documents, events, content, portal, etc.)
  @Column({ type: 'text' })
  resource: string;

  // Acción (create, update, delete, publish, upload…)
  @Column({ type: 'text' })
  action: string;

  // N:N con roles
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
