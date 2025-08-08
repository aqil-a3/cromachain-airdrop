import z from "zod";

export const airdropSchema = z.object({
  id: z.string().optional(),
  created_at: z.string().optional(),
  is_active: z.boolean(),
  title: z.string().min(1),
  time_left: z.date(),
  total_token: z.coerce.number(),
  token_claimed: z.coerce.number(),
  participants: z.coerce.number(),
  progress: z.coerce.number(),
});

export type AirdropSchemaType = z.infer<typeof airdropSchema>;
