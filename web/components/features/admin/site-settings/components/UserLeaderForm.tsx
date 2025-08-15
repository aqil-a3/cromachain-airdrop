import { LeaderboardUser } from "@/@types/user";
import { ValueEditProps } from "./ValueEdit";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UserLeaderboardForm({isLoading,setSiteSettings,siteSettings}:ValueEditProps){
  const [leaderboard, setLeaderBoard] = useState<LeaderboardUser>(
    siteSettings.value as LeaderboardUser
  );

  useEffect(() => {
    setSiteSettings((prev) => ({
      ...prev,
      value: leaderboard,
    }));
  }, [leaderboard]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const data = target.dataset.leaderboard as keyof LeaderboardUser;

    setLeaderBoard((prev) => ({
      ...prev,
      [data]: target.value,
    }));
  };

  return (
    <div className="space-y-4 py-4">
      <p>User Leaderboard Data</p>
      <Separator />

      <div className="space-y-4 px-4">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          disabled={isLoading}
          id="fullName"
          data-leaderboard="fullName"
          value={leaderboard?.fullName ?? ""}
          onChange={changeHandler}
        />
      </div>
      <div className="space-y-4 px-4">
        <Label htmlFor="createdAt">Join At</Label>
        <Input
          disabled={isLoading}
          id="createdAt"
          data-leaderboard="createdAt"
          value={leaderboard?.createdAt ?? ""}
          onChange={changeHandler}
        />
      </div>
      <div className="space-y-4 px-4">
        <Label htmlFor="invitationCount">Invitation Count</Label>
        <Input
          disabled={isLoading}
          id="invitationCount"
          data-leaderboard="invitationCount"
          value={leaderboard?.invitationCount ?? ""}
          onChange={changeHandler}
        />
      </div>
      <div className="space-y-4 px-4">
        <Label htmlFor="smartContract">Smart Contract</Label>
        <Input
          disabled={isLoading}
          id="smartContract"
          data-leaderboard="smartContract"
          value={leaderboard?.smartContract ?? ""}
          onChange={changeHandler}
        />
      </div>
    </div>
  );
};

