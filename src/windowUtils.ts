import { useEffect, useState } from "react";

const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

export const useWindow = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  return { width: windowSize.innerWidth, height: windowSize.innerHeight };
};
