import { TaskUser } from "@/@types/task-user";
import { Task } from "@/@types/tasks";
import { ColumnFiltersState, RowSelectionState } from "@tanstack/react-table";
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
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const value: TaskReviewContextState = {
    tasks,
    setTaskUsers,
    taskUsers,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection
  };
  return (
    <TaskReviewContext.Provider value={value}>
      {children}
    </TaskReviewContext.Provider>
  );
}

export const useTaskReviewData = () => useContext(TaskReviewContext);
