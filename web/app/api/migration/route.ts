import { TaskUser } from "@/@types/task-user";
import {
  getMigrationData,
  MigrationDataDB,
} from "@/utils/supabase/migrationTable";
import { getUserByIdBulks } from "@/utils/supabase/userTable";
import { getUserTasksByUserId } from "@/utils/supabase/userTaskTable";
import { NextRequest, NextResponse } from "next/server";

interface FullMigrationData extends MigrationDataDB {
  information: {
    userId?: string;
    email: string;
    full_name: string;
    telegram_username: string;
    discord_username: string;
    twitter_username: string;
  };
  taskProgress: TaskUser[];
}

export async function GET(req: NextRequest) {
  const headers = req.headers;
  const apiKey = headers.get("x-api-key");
  const correctKey = process.env.AIRDROP_SHARED_SECRET_KEY;

  if (!apiKey)
    return NextResponse.json({ message: "Key required" }, { status: 401 });
  if (apiKey !== correctKey)
    return NextResponse.json(
      { message: "Key is invalid! Access Denied" },
      { status: 401 }
    );

  const migrationData = await getMigrationData();
  const userIds = migrationData.map((val) => val.user_id);
  const userData = await getUserByIdBulks(userIds);
  const userInformation: FullMigrationData["information"][] = userData.map(
    (ui) => {
      const selectedData = userData.find((u) => u.userId === ui.userId);

      return {
        userId: selectedData!.userId,
        email: selectedData!.email,
        full_name: selectedData!.name,
        discord_username: selectedData!.discordUsername,
        telegram_username: selectedData!.telegramUsername,
        twitter_username: selectedData!.twitterUsername,
      };
    }
  );

  const userTasks = await Promise.all(
    userData.map(async ({ userId }) => {
      const result = await getUserTasksByUserId(String(userId));
      return result;
    })
  );

  const fullMigrationData: FullMigrationData[] = userIds.map((userId) => {
    const selectedMigration = migrationData.find(
      (mig) => mig.user_id === userId
    );
    const selectedInformation = userInformation.find(
      (inf) => inf.userId === userId
    );
    const selectedTaskProgress = userTasks.flatMap((task) => {
      const selected = task.filter((tu) => tu.userId === userId);
      return selected;
    });

    return {
      ...selectedMigration!,
      information: selectedInformation!,
      taskProgress: selectedTaskProgress ?? [],
    };
  });

  return NextResponse.json({ fullMigrationData });
}
