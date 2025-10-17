import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_a!: string;

  @Column('uuid')
  user_b!: string;

  @CreateDateColumn()
  created_at!: Date;
}