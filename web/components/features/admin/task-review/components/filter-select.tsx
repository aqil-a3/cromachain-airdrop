import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskReviewData } from "../provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { FaFilter } from "react-icons/fa6";
import FilterDialog from "./FilterDialog";

export default function FilterSelect() {
  const { tasks, setTaskUsers } = useTaskReviewData();
  const [value, setValue] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const retrieveHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/user-tasks?id=${value}`);
      setTaskUsers(data.data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Select onValueChange={setValue} value={value} disabled={isLoading}>
        <SelectTrigger className="w-[320px] bg-slate-700 text-white font-bold">
          <SelectValue placeholder="Select Tasks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectSeparator />
          {tasks.map((task) => (
            <SelectItem key={task.id} value={String(task.id)}>
              {task.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        disabled={isLoading}
        onClick={retrieveHandler}
        className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-300"
      >
        {isLoading ? "Retrieving..." : "Retrieve Data"}
      </Button>
      <FilterDialog />
    </div>
  );
}
