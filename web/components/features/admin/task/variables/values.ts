import { TaskFormSchema } from "../../../../../schemas/taskSchema";

export const taskDefaultValues: TaskFormSchema = {
  title: "",
  description: "",
  category: "social",
  platform: "",
  reward: 0,
  difficulty: "Easy",
  timeEstimate: "",
  status: "not-started",
  locked: false,
  iconName: "",
  action: "",
  link: undefined,
  requirements: [],
};