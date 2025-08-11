import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskReviewData } from "../provider";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskReviewBulksEditDialog from "./EditDialogBulks";
import Link from "next/link";

type RowSelection = Record<string, boolean>;

export default function InfoSection() {
  const { rowSelection, taskUsers } = useTaskReviewData();

  const mappedSelection: RowSelection = Object.fromEntries(
    Object.keys(rowSelection).map((index) => {
      const data = taskUsers[Number(index)];
      return [String(data?.id), true];
    })
  );

  const rowIdSelections = Object.keys(mappedSelection);

  if (rowIdSelections.length === 0) return null;

  return <MenuDropdown rowIdSelections={rowIdSelections} />;
}

const MenuDropdown: React.FC<{ rowIdSelections: string[] }> = ({
  rowIdSelections,
}) => {
  const totalSelcetions = rowIdSelections.length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="mt-4">
          {totalSelcetions} Selected
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions to {totalSelcetions} data</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/admin/task-review/bulks-edit?ids=${rowIdSelections.map(encodeURIComponent).join("-")}`} target="_blank">Bulks Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
