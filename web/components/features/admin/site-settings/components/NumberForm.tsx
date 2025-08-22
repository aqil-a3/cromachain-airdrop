import React, { useEffect, useState } from "react";
import { ValueEditProps } from "./ValueEdit";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function NumberForm({
  isLoading,
  setSiteSettings,
  siteSettings,
}: ValueEditProps) {
  const [valueNumber, setValueNumber] = useState<number>(
    Number(siteSettings.value)
  );

  useEffect(() => {
    setSiteSettings((prev) => ({
      ...prev,
      value: valueNumber,
    }));
  }, [valueNumber, setSiteSettings]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.valueAsNumber;

    setValueNumber(value);
  };

  return (
    <div className="space-y-4 py-4">
      <p>Referral Limit Per Day</p>
      <Separator />

      <div>
        <Label htmlFor="referral-limit">Limit</Label>
        <Input type="number" onChange={changeHandler} value={valueNumber} />
      </div>
    </div>
  );
}
