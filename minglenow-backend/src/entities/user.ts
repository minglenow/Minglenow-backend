import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true })
  password_hash?: string;

  @Column()
  display_name!: string;

  @Column({ type: 'date', nullable: true })
  dob?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'boolean', default: false })
  is_verified!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  vip_until?: Date;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  location?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}