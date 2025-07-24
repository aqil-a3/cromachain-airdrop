import { UserProfile } from "@/@types/user";
import DeleteDialog from "@/components/molecules/Dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { deleteUser } from "../actions/deleteUser";

export const userColumns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "actions",
    header: "Actions",
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
                href={`/admin/user/edit/${id}`}
                className="flex justify-center items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteDialog
                onConfirm={() => deleteUser(row.original.userId as string)}
                dataSummary={[
                  {
                    label: "User Email",
                    value: row.original.email,
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telegramUsername",
    header: "Telegram",
  },
  {
    accessorKey: "discordUsername",
    header: "Discord",
  },
  {
    accessorKey: "twitterUsername",
    header: "Twitter",
  },
  {
    accessorKey: "ethAddress",
    header: "ETH Address",
    cell: ({ row }) => {
      const address = row.original.ethAddress;
      return (
        <span className="font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <span
          className={
            role === "admin" ? "text-red-600 font-semibold" : "text-green-600"
          }
        >
          {role}
        </span>
      );
    },
  },
];
