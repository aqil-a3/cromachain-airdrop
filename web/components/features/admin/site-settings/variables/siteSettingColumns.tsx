import { SiteSettings } from "@/@types/site-settings";
import { ColumnDef } from "@tanstack/react-table";
import ActionDropdown from "../components/ActionDropdown";

export const siteSettingsColumns: ColumnDef<SiteSettings>[] = [
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionDropdown row={row} />,
  },
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      if (typeof row.original.value === "object")
        return JSON.stringify(row.original.value);

      return row.original.value;
    },
  },
];
