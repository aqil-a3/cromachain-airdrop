import { SiteSettings } from "@/@types/site-settings";
import DeleteDialog from "@/components/molecules/Dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontalIcon, Pencil } from "lucide-react";
import EditSettingSheet from "./EditSettingSheet";
import { useState } from "react";

export default function ActionDropdown({ row }: { row: Row<SiteSettings> }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{row.original.label}</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => {
              setDropdownOpen(false);
              setSheetOpen(true);
            }}
          >
            <Button variant="ghost" className="w-full">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditSettingSheet
        row={row}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
