import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/@types/tasks";
import { Badge } from "@/components/ui/badge";
import {
  LucideIcon,
  icons as LucideIcons,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "actions",
    header: "Acttions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/task/edit/${id}`}
                className="flex justify-center items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                variant={"ghost"}
                className="w-full cursor-pointer text-red-500"
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as Task["category"];
      return <Badge variant="secondary">{category}</Badge>;
    },
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "reward",
    header: "Reward (CROMA)",
    cell: ({ row }) => {
      return <span>{row.getValue("reward")} 🪙</span>;
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const diff = row.getValue("difficulty") as Task["difficulty"];
      const colorMap = {
        Easy: "green",
        Medium: "orange",
        Hard: "red",
      } as const;
      return (
        <Badge
          className={`bg-${colorMap[diff]}-100 text-${colorMap[diff]}-800`}
        >
          {diff}
        </Badge>
      );
    },
  },
  {
    accessorKey: "timeEstimate",
    header: "Time (min)",
    cell: ({ row }) => <span>{row.getValue("timeEstimate")} min</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Task["status"];
      const label = {
        "not-started": "⏳ Not Started",
        "pending-verification": "🔎 Pending",
        completed: "✅ Completed",
        failed: "❌ Failed",
      }[status];
      return <span>{label}</span>;
    },
  },
  {
    accessorKey: "locked",
    header: "Locked?",
    cell: ({ row }) => (row.getValue("locked") ? "🔒" : "🔓"),
  },
  {
    accessorKey: "iconName",
    header: "Icon",
    cell: ({ row }) => {
      const name = row.getValue("iconName") as string;
      const LucideIcon = (LucideIcons as Record<string, LucideIcon>)[name];
      return LucideIcon ? (
        <div className="flex items-center gap-2">
          <LucideIcon className="w-5 h-5" />
          <span className="text-sm text-muted-foreground">{name}</span>
        </div>
      ) : (
        <span className="text-red-500 italic">Invalid icon</span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const url = row.getValue("link");
      return url ? (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Visit
        </Link>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "requirements",
    header: "Requirements",
    cell: ({ row }) => {
      const reqs = row.getValue("requirements") as string[] | undefined;
      return reqs && reqs.length > 0 ? (
        <ul className="text-xs list-disc list-inside">
          {reqs.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      ) : (
        <span>-</span>
      );
    },
  },
];
