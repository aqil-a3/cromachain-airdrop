import { UserSchemaType } from "@/schemas/userSchema";

export const userDefaultValues: UserSchemaType = {
  role: "user",
  isHuman: false,
  discordUsername: "",
  email: "",
  password: "",
  confirmPassword: "",
  ethAddress: "",
  name: "",
  telegramUsername: "",
  twitterUsername: "",
};
