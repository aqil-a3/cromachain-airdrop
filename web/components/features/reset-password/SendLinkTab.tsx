import { TabsContent } from "@/components/ui/tabs";
import ForgotPasswordForm from "./SendLinkForm";

export default function SendLinkTab() {
  return (
    <TabsContent
      value="send-link"
      className="bg-black/90 border border-white/10 backdrop-blur-md text-white sm:max-w-md p-6 rounded-lg space-y-6"
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Enter Email</h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <ForgotPasswordForm />

        <p className="text-xs text-gray-100 text-center">
          Make sure to check your spam folder if you don’t see the email.
        </p>
      </div>
    </TabsContent>
  );
}
