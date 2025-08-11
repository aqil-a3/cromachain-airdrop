import { TaskUser } from "@/@types/task-user";
import DeleteDialog from "@/components/molecules/Dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, Pencil } from "lucide-react";
import TaskReviewEditDialog from "../components/EditDialog";
import { Checkbox } from "@/components/ui/checkbox";

export const taskUserColumnDefs: ColumnDef<TaskUser>[] = [
  {
    id: "select-col",
    header: ({ table }) => {
      const isAllSelected = table.getIsAllRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();

      return (
        <Checkbox
          checked={
            isAllSelected ? true : isSomeSelected ? "indeterminate" : false
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="bg-white"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="bg-white"
      />
    ),
  },

  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <TaskReviewEditDialog row={row} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteDialog
                dataSummary={[
                  {
                    label: "User Full Name",
                    value: row.original.user?.fullName ?? "",
                  },
                  {
                    label: "Task Title",
                    value: row.original.task?.title ?? "",
                  },
                ]}
                triggerText="Delete"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "id",
    id: "id",
    header: "ID",
  },
  {
    accessorKey: "user.fullName",
    id: "user.fullName",
    header: "Name",
  },
  {
    accessorKey: "user.email",
    id: "user.email",
    header: "Email",
  },
  {
    accessorKey: "task.title",
    id: "task.title",
    header: "Task",
  },
  {
    accessorKey: "task.category",
    id: "task.category",
    header: "Category",
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const color =
        status === "completed"
          ? "text-green-600"
          : status === "failed"
            ? "text-red-600"
            : "text-yellow-600";
      return <span className={color}>{status}</span>;
    },
  },
  {
    accessorKey: "rewardEarned",
    id: "rewardEarned",
    header: "Croma Earned",
    cell: ({ row }) => `${row.original.rewardEarned} CRM`,
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: "Started At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return date ? new Date(date as string).toLocaleString() : "-";
    },
  },
];
