import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTaskReviewData } from "../provider";
import { useMemo } from "react";

type Props = {
  ids: string[];
};

export default function TaskReviewBulksEditDialog({ ids }: Props) {
  const { taskUsers } = useTaskReviewData();

  const task = useMemo(
    () => taskUsers.filter((tur) => ids.includes(String(tur.id))),
    [ids, taskUsers]
  );

  return (
    <Dialog>
      <DialogTrigger>Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
