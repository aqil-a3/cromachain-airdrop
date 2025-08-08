import { TaskUser } from "@/@types/task-user";
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
import axios from "axios";
import { PlayCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlayDialog({ task }: { task: Task }) {
  const { data } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = data?.user;
  const router = useRouter();

  const startHandler = async () => {
    try {
      setIsLoading(true);
      const clientData: TaskUser = {
        status: "started",
        taskId: task.id ?? "",
        userId: user?.userId ?? "",
        rewardEarned: 0,
        rewardType:""
      };
      const { data } = await axios.post(`/api/user-tasks`, clientData);

      alert(data.message);
      router.refresh();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <PlayCircle className="text-amber-500" />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure to start this task?</DialogTitle>
        </DialogHeader>
        <div className="bg-slate-100 p-2 rounded-md">
          <p>
            <strong>Task Name : </strong>
            {task.title}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            className="bg-amber-700 hover:bg-amber-500"
            disabled={isLoading}
            onClick={startHandler}
          >
            {isLoading ? "Starting..." : "Start"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
