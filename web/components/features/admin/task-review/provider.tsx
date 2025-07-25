import { TaskUser } from "@/@types/task-user";
import { Task } from "@/@types/tasks";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface TaskReviewContextState {
  tasks: Task[];
  taskUsers: TaskUser[];
  setTaskUsers: Dispatch<SetStateAction<TaskUser[]>>;
}

const TaskReviewContext = createContext<TaskReviewContextState>(
  {} as TaskReviewContextState
);

interface TaskReviewProviderProps {
  children: React.ReactNode;
  tasks: Task[];
}

export default function TaskReviewProvider({
  tasks,
  children,
}: TaskReviewProviderProps) {
  const [taskUsers, setTaskUsers] = useState<TaskUser[]>([]);
  const value: TaskReviewContextState = {
    tasks,
    setTaskUsers,
    taskUsers,
  };
  return (
    <TaskReviewContext.Provider value={value}>
      {children}
    </TaskReviewContext.Provider>
  );
}

export const useTaskReviewData = () => useContext(TaskReviewContext);
