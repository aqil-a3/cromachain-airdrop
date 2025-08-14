import { LeaderboardUser } from "@/@types/user";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const leaderboardColumns: ColumnDef<LeaderboardUser>[] = [
  {
    accessorKey:"ranking",
    header:"Top #",
  },
  {
    accessorKey: "fullName",
    id: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
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
