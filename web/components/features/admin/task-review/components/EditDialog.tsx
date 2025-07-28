"use client";

import { TaskUser } from "@/@types/task-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Row } from "@tanstack/react-table";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function TaskReviewEditDialog({ row }: { row: Row<TaskUser> }) {
  const { cromaEarned, status, taskId, userId, createdAt, task, user } =
    row.original;

  const [newStatus, setNewStatus] = useState(status);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      const formData: TaskUser = { ...row.original, status: newStatus };
      setIsLoading(true);

      const { data } = await axios.put("/api/user-tasks/status", formData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task Review</DialogTitle>
          <DialogDescription>
            Only status can be edited. Other fields are read-only.
          </DialogDescription>
        </DialogHeader>

        {/* Read-only fields */}
        <div className="grid gap-4 py-4">
          <div>
            <Label>User</Label>
            <Input value={`${user?.fullName} (${user?.email})`} disabled />
          </div>
          <div>
            <Label>Task</Label>
            <Input value={`${task?.title} - ${task?.category}`} disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Task ID</Label>
              <Input value={taskId} disabled />
            </div>
            <div>
              <Label>User ID</Label>
              <Input value={userId} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Created At</Label>
              <Input
                value={new Date(createdAt || "").toLocaleString()}
                disabled
              />
            </div>
            <div>
              <Label>CROMA Earned</Label>
              <Input value={cromaEarned} disabled />
            </div>
          </div>

          {/* Editable field: Status */}
          <div>
            <Label>Status</Label>
            <Select disabled={isLoading} value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="started">Started</SelectItem>
                <SelectItem value="pending-verification">
                  Pending Verification
                </SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button disabled={isLoading} onClick={handleSave}>{isLoading ? "Saving..." : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
