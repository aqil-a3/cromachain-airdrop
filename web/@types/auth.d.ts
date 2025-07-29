export interface PasswordResetToken {
  id?: string;
  user_id: string;
  token: string;
  created_at?: string;
  expired_at: string;
  used: boolean;
}
