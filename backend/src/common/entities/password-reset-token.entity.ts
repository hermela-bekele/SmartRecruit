import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => User, (user) => user.resetTokens)
  user: User;
}
