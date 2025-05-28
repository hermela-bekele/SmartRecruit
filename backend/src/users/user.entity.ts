import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordResetToken } from '../common/entities/password-reset-token.entity';
import { UserRole } from '../shared/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.HR_ADMIN,
  })
  role: UserRole;

  @Column({ default: true })
  passwordResetRequired: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  resetTokens: PasswordResetToken[];
}
