  export interface Task {
    readonly id?: string;
    title: string;
    description: string;
    category: "social" | "onchain" | "community" | "bonus";
    platform: string;
    reward: number; // CROMA tokens
    difficulty: "Easy" | "Medium" | "Hard";
    timeEstimate: string;
    status: "not-started" | "pending-verification" | "completed" | "failed";
    locked: boolean;
    iconName: string; // Changed from icon to iconName
    action: string; // e.g., "Follow", "Retweet", "Join"
    link?: string;
    requirements?: string[];
  }

export interface TaskDB {
  id?: string;
  title: string;
  description: string;
  category: string; // social | onchain | community | bonus
  platform: string;
  reward: number; // in CROMA tokens
  difficulty: string; // Easy | Medium | Hard
  time_estimate: number;
  status: string; // not-started | pending-verification | completed | failed
  locked: boolean;
  icon_name: string;
  action: string;
  link: string | null;
  requirements: string | null; // JSON string (representing string[])
}
