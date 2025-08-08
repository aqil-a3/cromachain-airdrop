import { UserSchemaType } from "@/schemas/userSchema";

export const userDefaultValues: UserSchemaType = {
  role: "user",
  discordUsername: "",
  email: "",
  password: "",
  confirmPassword: "",
  ethAddress: "",
  name: "",
  telegramUsername: "",
  twitterUsername: "",
};
