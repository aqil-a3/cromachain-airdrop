import { postUser } from "@/components/features/admin/user/actions/postUser";
import UserForm from "@/components/molecules/Form/UserForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";
import React, { SetStateAction } from "react";

interface RegistrationDialogProps {
  showRegistration: boolean;
  setShowRegistration: React.Dispatch<SetStateAction<boolean>>;
}

export default function RegistrationDialog({
  setShowRegistration,
  showRegistration,
}: RegistrationDialogProps) {
  return (
    <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
      <DialogContent className="bg-black/90 border border-orange-500/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Complete Your Registration
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Fill in your social media accounts and wallet address to participate
            in the airdrop.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-900/20 border-yellow-500/30 mb-6">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            <strong>Important:</strong> Make sure to use the exact usernames
            from your social media accounts. When the airdrop is distributed,
            our AI will audit whether these accounts actually completed the
            tasks. Using different names may cause issues during the claim
            process.
          </AlertDescription>
        </Alert>

        <ScrollArea className="h-96">
          <UserForm onSubmit={async (data) => await postUser(data)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
