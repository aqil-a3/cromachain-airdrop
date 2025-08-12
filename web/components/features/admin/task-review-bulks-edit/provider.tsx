import { TaskUser } from "@/@types/task-user";
import React, { createContext, useContext, useState, useCallback } from "react";

// TR = Tasks Review
interface ContextState {
  taskReviews: TaskUser[];
  selectedIds: (string | number)[];
  toggleSelect: (id: string | number) => void;
  clearSelection: () => void;
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
}

const TR_BulksEditContext = createContext<ContextState>({} as ContextState);

interface Props {
  children: React.ReactNode;
  taskReviews: TaskUser[];
}

export default function TRBulksEditProvider({ children, taskReviews }: Props) {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleSelect = useCallback((id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const value: ContextState = {
    taskReviews,
    selectedIds,
    toggleSelect,
    clearSelection,
    isLoading,
    setIsLoading,
  };

  return (
    <TR_BulksEditContext.Provider value={value}>
      {children}
    </TR_BulksEditContext.Provider>
  );
}

export const useTRBulksEdit = () => useContext(TR_BulksEditContext);
