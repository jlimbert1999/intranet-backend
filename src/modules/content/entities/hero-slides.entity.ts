import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HeroSlides {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column({ default: 0 })
  order: number;
}
