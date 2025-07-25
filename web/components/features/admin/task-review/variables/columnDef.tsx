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
import Link from "next/link";

export const taskUserColumnDefs: ColumnDef<TaskUser>[] = [
  {
    accessorKey: "actions",
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
              <Link
                href={`/admin/task-review/edit/${id}`}
                className="flex justify-center items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
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
    header: "ID",
  },
  {
    accessorKey: "user.fullName",
    header: "Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "task.title",
    header: "Task",
  },
  {
    accessorKey: "task.category",
    header: "Category",
  },
  {
    accessorKey: "status",
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
    accessorKey: "createdAt",
    header: "Started At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return date ? new Date(date as string).toLocaleString() : "-";
    },
  },
];
