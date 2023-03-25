import { useEffect } from "react";

const useScrollTop = () => {
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth" });
  }, []);
};

export default useScrollTop;
