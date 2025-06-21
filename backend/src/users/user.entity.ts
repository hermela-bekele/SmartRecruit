import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordResetToken } from '../common/entities/password-reset-token.entity';
import { UserRole } from '../shared/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  // Profile fields
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  companySize: string;

  // Two-factor authentication
  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true, type: 'varchar' })
  twoFactorSecret: string | null;

  // Notification preferences
  @Column({ default: true })
  newApplicationNotifications: boolean;

  @Column({ default: true })
  statusChangeNotifications: boolean;

  @Column({ default: true })
  interviewReminderNotifications: boolean;

  @Column({ default: false })
  weeklyDigestNotifications: boolean;

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  resetTokens: PasswordResetToken[];
}
