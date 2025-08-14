import { LeaderboardUser } from "@/@types/user";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const leaderboardColumns: ColumnDef<LeaderboardUser>[] = [
  {
    accessorKey: "ranking",
    header: "Top #",
  },
  {
    accessorKey: "fullName",
    id: "fullName",
    header: "Name",
  },
  {
    accessorKey: "smartContract",
    id: "smartContract",
    header: "Smart Contract",
    cell: ({ row }) => {
      const address = row.original.smartContract;
      return (
        <span className="font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      );
    },
  },
  {
    accessorKey: "invitationCount",
    id: "invitationCount",
    header: "Total Invitation",
    cell: ({ row }) => `${row.original.invitationCount} Invitations`,
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: "Join",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const date = dayjs(createdAt).format("DD MMMM YYYY");

      return date;
    },
  },
];
