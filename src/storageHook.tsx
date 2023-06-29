import { useEffect } from "react";

export const useSmartSession = () => {
  useEffect(() => {
    sessionStorage.setItem("previousPathname", "other");
  }, []);
};
