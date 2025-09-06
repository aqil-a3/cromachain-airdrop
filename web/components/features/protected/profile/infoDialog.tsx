"use client";

import { Task } from "@/@types/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { useState } from "react";

export default function TaskDetailDialog({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Info className="text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 text-white max-w-lg break-all max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Title:</strong> {task.title}
          </p>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <div className="flex gap-1 items-center">
            <strong>Category:</strong>
            <Badge
              variant="outline"
              className="capitalize text-white border-white"
            >
              {task.category}
            </Badge>
          </div>
          <p>
            <strong>Platform:</strong> {task.platform}
          </p>
          <p>
            <strong>Action:</strong> {task.action}
          </p>
          <p>
            <strong>Reward:</strong>{" "}
            <Badge className="bg-amber-100 text-amber-700">
              {task.reward} CROMA
            </Badge>
          </p>
          <p>
            <strong>Difficulty:</strong> {task.difficulty}
          </p>
          <p>
            <strong>Estimated Time:</strong> {task.timeEstimate} Minutes
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge
              className={
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-700"
              }
            >
              {task.status}
            </Badge>
          </p>
          {task.requirements && task.requirements.length > 0 && (
            <div>
              <strong>Requirements:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {task.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          {task.link && (
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Visit Task ↗
              </a>
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-orange-500 hover:bg-orange-400 cursor-pointer">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
