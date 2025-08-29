export interface UserNftRewardsDB {
  id?: string;
  created_at?: string;
  buyer_id: string;
  inviter_id?: string;
  tx_hash: string;
  points: number;
}
