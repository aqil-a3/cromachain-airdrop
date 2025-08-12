"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRBulksEdit } from "../provider";
import { TaskStatus } from "@/@types/tasks";
import { FaSpinner } from "react-icons/fa6";
import axios from "axios";

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "not-started", label: "Not Started" },
  { value: "started", label: "Started" },
  { value: "pending-verification", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "completed", label: "Completed" },
];

export default function BulkEditPanel() {
  const { selectedIds, clearSelection, isLoading, setIsLoading, taskReviews } =
    useTRBulksEdit();
  const [status, setStatus] = useState<string>("");

  const selectedData = taskReviews
    .filter((tr) => selectedIds.includes(tr.id!))
    .map((tr) => ({ ...tr, status }));

    const allData = taskReviews.map((tr) => ({...tr, status}))

  const handleApply = async (mode: "selected" | "all") => {
    if (!status) return;
    const clientData = mode === "all" ? allData : selectedData;
    try {
      setIsLoading(true);
      const { data } = await axios.put(
        "/api/user-tasks/status/bulks",
        clientData
      );

      alert(data.message);
      window.close()
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm border">
      <Select
        onValueChange={(val) => setStatus(val)}
        value={status}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={() => handleApply("selected")}
        disabled={!status || selectedIds.length === 0 || isLoading}
      >
        Apply to Selected ({selectedIds.length})
      </Button>

      <Button
        variant="secondary"
        onClick={() => handleApply("all")}
        disabled={!status || isLoading}
      >
        Apply to All
      </Button>

      <Button
        variant="destructive"
        onClick={clearSelection}
        disabled={selectedIds.length === 0 || isLoading}
      >
        Clear
      </Button>

      {isLoading && (
        <span className="flex items-center gap-4">
          <FaSpinner className="animate-spin" /> Please Wait...
        </span>
      )}
    </div>
  );
}
