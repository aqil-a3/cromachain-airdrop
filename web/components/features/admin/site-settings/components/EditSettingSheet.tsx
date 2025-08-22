import { SiteSettings } from "@/@types/site-settings";
import { LeaderboardUser } from "@/@types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Row } from "@tanstack/react-table";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import ValueEdit from "./ValueEdit";
import { useRouter } from "next/navigation";

interface Props {
  row: Row<SiteSettings>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSettingSheet({ row, open, onOpenChange }: Props) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(row.original);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const saveHandler = async () => {
    try {
      setIsLoading(true);

      await axios.post("/api/site-settings", siteSettings);
      alert("Site setting successfully edited");
      onOpenChange(false);
      location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="space-y-4 py-8">
        <SheetHeader>
          <SheetTitle>{row.original.label}</SheetTitle>
          <SheetDescription>Edit site setting</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            <Label htmlFor="key">Key</Label>
            <Input id="key" disabled readOnly value={siteSettings.key} />
          </div>
          <div className="space-y-4">
            <Label htmlFor="label">Setting Name</Label>
            <Input
              id="label"
              value={siteSettings.label}
              disabled={isLoading}
              onChange={(e) =>
                setSiteSettings({ ...siteSettings, label: e.target.value })
              }
            />
          </div>
          <ValueEdit
            setSiteSettings={setSiteSettings}
            siteSettings={siteSettings}
            isLoading={isLoading}
          />
        </ScrollArea>
        <Button variant={"outline"} onClick={saveHandler} disabled={isLoading}>
          {isLoading ? (
            <span className="flex gap-4">
              <Loader className="animate-spin" /> Saving...
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
