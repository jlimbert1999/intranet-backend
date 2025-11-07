import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TutorialVideo } from './tutorial-topic.entiry';

@Entity('assistance_tutorials')
export class Tutorial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => TutorialVideo, (video) => video.tutorial, {
    cascade: true,
    eager: true,
  })
  videos: TutorialVideo[];
}
