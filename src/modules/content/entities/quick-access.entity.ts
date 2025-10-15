import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quick_accesses')
export class QuickAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: 0 })
  order: number;
}
