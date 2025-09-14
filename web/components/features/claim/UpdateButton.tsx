import { Button } from "@/components/ui/button";
import axios, { isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isChecking: boolean;
  setIsChecking: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setCromaPoint: Dispatch<SetStateAction<number | null>>;
}
export default function UpdateButton({
  setCromaPoint,
  setErrorMessage,
  setIsChecking,
  isChecking,
}: Props) {
  const handleUpdatePoint = async () => {
    try {
      setIsChecking(true);
      setErrorMessage("");

      const { data } = await axios.patch("/api/user/wallet/update");

      console.log(data.data.total_points);
      setCromaPoint(data.data.total_points);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        const data = error.response?.data;

        setErrorMessage(data.message ?? "Something wrong!");
      }
    } finally {
      setIsChecking(false);
    }
  };
  return (
    <Button
      variant={"outline"}
      className="w-full"
      disabled={isChecking}
      onClick={handleUpdatePoint}
    >
      {isChecking ? "Updating..." : "Update Point!"}
    </Button>
  );
}
