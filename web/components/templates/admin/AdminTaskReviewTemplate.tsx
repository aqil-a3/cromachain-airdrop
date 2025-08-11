"use client";

import { Task } from "@/@types/tasks";
import FilterSelect from "@/components/features/admin/task-review/components/filter-select";
import InfoSection from "@/components/features/admin/task-review/components/InfoSection";
import TaskReviewProvider, {
  useTaskReviewData,
} from "@/components/features/admin/task-review/provider";
import { taskUserColumnDefs } from "@/components/features/admin/task-review/variables/columnDef";
import AdminContainer from "@/components/layouts/container/AdminContainer";
import { DataTable } from "@/components/ui/data-table";

export default function AdminTaskReviewTemplate({ tasks }: { tasks: Task[] }) {
  return (
    <TaskReviewProvider tasks={tasks}>
      <InnerTemplate />
    </TaskReviewProvider>
  );
}

const InnerTemplate = () => {
  const {
    taskUsers,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
  } = useTaskReviewData();

  return (
    <AdminContainer>
      <FilterSelect />
      <InfoSection />
      <DataTable
        columns={taskUserColumnDefs}
        data={taskUsers}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        enableMultiRowSelection
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </AdminContainer>
  );
};
