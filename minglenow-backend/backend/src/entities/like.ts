import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  from_user!: string;

  @Column('uuid')
  to_user!: string;

  @CreateDateColumn()
  created_at!: Date;
}