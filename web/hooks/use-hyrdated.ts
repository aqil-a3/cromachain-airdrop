import { useEffect, useState } from "react";

export function useHydrated() {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
