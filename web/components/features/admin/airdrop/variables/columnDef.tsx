import { ColumnDef } from "@tanstack/react-table";
import { Airdrop } from "@/@types/airdrop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import DeleteDialog from "@/components/molecules/Dialog/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { deleteAirdrop } from "../actions/deleteAirdrop";

export const airdropColumns: ColumnDef<Airdrop>[] = [
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
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/airdrop/edit/${id}`}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteDialog
                dataSummary={[
                  {
                    label: "Airdrop Title",
                    value: row.original.title,
                  },
                ]}
                triggerText="Delete"
                onConfirm={() => deleteAirdrop(id as string)}
              />
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
    accessorKey: "time_left",
    header: "Time Left",
    cell: ({ row }) => {
      const value = row.getValue("time_left") as string;
      const [formatted, setFormatted] = useState("");

      useEffect(() => {
        const date = new Date(value);
        const formatter = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        setFormatted(formatter.format(date));
      }, [value]);

      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "total_token",
    header: "Total Token",
    cell: ({ row }) => <span>{row.getValue("total_token")} 🪙</span>,
  },
  {
    accessorKey: "token_claimed",
    header: "Token Claimed",
    cell: ({ row }) => <span>{row.getValue("token_claimed")} 🪙</span>,
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => <span>{row.getValue("participants")} 👥</span>,
  },
  {
    accessorKey: "progress",
    header: "Progress (%)",
    cell: ({ row }) => {
      const value = row.getValue("progress") as number;
      return <span>{value}%</span>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Active?",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active ✅" : "Inactive ❌"}
        </Badge>
      );
    },
  },
];
