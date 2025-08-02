export interface Airdrop {
  id?: string;
  created_at?: string;
  time_left: string;
  total_token: number;
  token_claimed: number;
  participants: number;
  progress: number;
  is_active: boolean;
}
