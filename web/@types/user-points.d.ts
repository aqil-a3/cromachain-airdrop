export interface UserTasksPoint {
  user_id: string;
  reward_earned: number;
  reward_type: string;
}

export interface UserReferralsPoint {
  referrer_id: string;
  points: number;
}

export interface UserPoints extends UserTasksPoint {}
