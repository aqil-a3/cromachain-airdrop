import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  telegramUsername: z.string().min(1, "Telegram username is required"),
  discordUsername: z.string().min(1, "Discord username is required"),
  twitterUsername: z.string().min(1, "Twitter username is required"),
  ethAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  role: z.string()
});

export type UserSchemaType = z.infer<typeof userSchema>;
