import { Task } from "@/@types/tasks";
import { fadeInUp } from "@/components/templates/HomeTemplate";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTaskIcon } from "@/lib/tasks";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PlayDialog from "./playDialog";
import TaskDetailDialog from "./infoDialog";
import { TaskUser } from "@/@types/task-user";

const getTaskStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "started":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "pending-verification":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "failed":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "not-started":
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

interface Props {
  tasks: Task[];
  userTasks: TaskUser[];
}

export default function TaskListCard({ tasks, userTasks }: Props) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="bg-black/40 backdrop-blur-md border border-orange-500/30 p-6 md:p-8 text-left">
        <h2 className="text-2xl font-bold text-white mb-4">Your Tasks</h2>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-white">
              You have no tasks for now. Please wait for the next task.
            </p>
          ) : (
            tasks.map((task) => {
              const IconComponent = getTaskIcon(task.iconName);
              const userTask = userTasks.find((t) => t.taskId === task.id);
              const userTaskStatus = userTask?.status as Task["status"];
              const taskStatus = userTaskStatus ?? task.status;
              const taskReward = task.reward;
              const rewardType = task.rewardType;

              return (
                <div
                  key={task.id}
                  className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between p-3 rounded-lg bg-gray-900/30"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${getTaskStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-semibold ${
                          task.status === "completed"
                            ? "text-green-400"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="flex gap-2">
                        <Badge className="text-orange-500 border-orange-500">
                          {taskReward} {rewardType}
                        </Badge>
                        {task.link && (
                          <Link
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge className="text-amber-500 border-amber-500">
                              Visit ↗
                            </Badge>
                          </Link>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      className={getTaskStatusColor(
                        userTaskStatus ?? task.status
                      )}
                    >
                      {taskStatus
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                    {taskStatus === "not-started" && <PlayDialog task={task} />}
                    <TaskDetailDialog task={task} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </motion.div>
  );
}
