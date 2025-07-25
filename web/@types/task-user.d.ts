export interface TaskUserDb {
  id?: number;
  created_at?: string;
  user_id: string;
  task_id: string;
  status: string;
  user?: {
    email: string;
    full_name: string;
  };
  task?: {
    title: string;
    category: string;
  };
}

export interface TaskUser {
  id?: number;
  createdAt?: string;
  userId: string;
  taskId: string;
  status: string;
  user?: {
    email: string;
    fullName: string;
  };
  task?: {
    title: string;
    category: string;
  };
}
