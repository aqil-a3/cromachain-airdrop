import { z } from "zod";

export const userSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    telegramUsername: z
      .string()
      .min(1, "Telegram username is required")
      .refine((val) => !val.startsWith("@"), {
        message: "Telegram username should not start with @",
      }),
    discordUsername: z
      .string()
      .min(1, "Discord username is required")
      .refine((val) => !val.startsWith("@"), {
        message: "Discord username should not start with @",
      }),
    twitterUsername: z
      .string()
      .min(1, "Twitter username is required")
      .refine((val) => !val.startsWith("@"), {
        message: "Twitter username should not start with @",
      }),
    ethAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    role: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserSchemaType = z.infer<typeof userSchema>;
