import { UserSchemaType } from "@/schemas/userSchema";

export const userDefaultValues: UserSchemaType = {
  role: "user",
  discordUsername: "",
  email: "",
  isHuman: false,
  password: "",
  confirmPassword: "",
  ethAddress: "",
  name: "",
  telegramUsername: "",
  twitterUsername: "",
};
