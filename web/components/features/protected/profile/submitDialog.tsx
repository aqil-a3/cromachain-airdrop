import { Task } from "@/@types/tasks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpFromLine } from "lucide-react";

export default function SubmitDialog({ task }: { task: Task }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <ArrowUpFromLine className="text-green-500" />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
          <DialogDescription>Submit {task.title}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
