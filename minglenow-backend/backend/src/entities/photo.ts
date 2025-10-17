import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => (user as any).photos, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  s3_key!: string;

  @Column({ default: false })
  is_profile!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}