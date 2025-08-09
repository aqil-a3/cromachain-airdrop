import UserForm from "@/components/molecules/Form/UserForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { registerUserWithReferral } from "../actions/registerUserWithReferral";

export default function MainJoin() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <main className="w-4/5 flex items-center justify-center">
      <div className="bg-black/90 p-4 w-2/3">
        <h1 className="font-bold underline text-white text-2xl text-center">
          Join With Referral
        </h1>
        <div>
          <Label htmlFor="referral">Referral Used</Label>
          <Input
            disabled
            readOnly
            value={ref ?? ""}
            className="w-full bg-black text-white"
          />
          <UserForm onSubmit={(value) => registerUserWithReferral(value, ref)} />
        </div>
      </div>
    </main>
  );
}
