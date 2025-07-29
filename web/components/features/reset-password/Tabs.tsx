import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SendLinkTab from "./SendLinkTab";
import ResetPasswordTab from "./ResetPasswordTab";

export default function ResetPasswordTabs() {
  return (
    <Tabs
      defaultValue="send-link"
      className="w-full max-w-md bg-black/70 p-6 rounded-lg backdrop-blur"
    >
      <TabsList className="bg-gray-800 rounded-md">
        <TabsTrigger
          value="send-link"
          className="[data-state=active]:bg-orange-500 [data-state=active]:text-white text-orange-400"
        >
          Send Link
        </TabsTrigger>
        <TabsTrigger
          value="reset-password"
          className="[data-state=active]:bg-orange-500 [data-state=active]:text-white text-orange-400"
        >
          Reset Password
        </TabsTrigger>
      </TabsList>

      <SendLinkTab />
      <ResetPasswordTab />
    </Tabs>
  );
}
