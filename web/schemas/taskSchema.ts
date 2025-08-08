import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["social", "onchain", "community", "bonus"]),
  platform: z.string().min(1),
  reward: z.number().nonnegative(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  timeEstimate: z.string().min(1),
  status: z.enum(["not-started", "pending-verification", "completed", "failed", "started"]),
  locked: z.boolean(),
  iconName: z.string().min(1),
  action: z.string().min(1),
  link: z.string().url().optional(),
  requirements: z.array(z.string()).optional(),
});

export type TaskFormSchema = z.infer<typeof taskSchema>
