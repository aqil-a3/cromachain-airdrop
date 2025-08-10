import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminUserData } from "../provider";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function UserPointsCell({ userId }: { userId: string }) {
  const { userPoints, users } = useAdminUserData();

  const selectedPoints = userPoints.filter((up) => up.user_id === userId);
  const selectedUser = users.find((user) => user.id! === userId)!;

  const totalPoints = selectedPoints
    .map((tp) => tp.reward_earned)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2">
        <span>{totalPoints}</span>
        <Info size={16} />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="font-semibold">{selectedUser.email}</p>
        <Separator />
        <p className="font-semibold">Total Points : {totalPoints}</p>
        <ul className="list-disc list-inside space-y-1">
          {selectedPoints.map((sp, index) => (
            <li key={index + 1}>
              {sp.reward_type} : {sp.reward_earned}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
