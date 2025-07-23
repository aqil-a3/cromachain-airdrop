import * as LucideIcons from "lucide-react";

export const lucideIconNames = Object.keys(LucideIcons);
const isDevelopment = process.env.NODE_ENV === "development";
export const endpointServer = isDevelopment ? "http://localhost:3000" :"https://cromachain-airdrop.vercel.app"