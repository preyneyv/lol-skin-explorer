import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollFix() {
  const location = useLocation();
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }, [location]);
  return null;
}
