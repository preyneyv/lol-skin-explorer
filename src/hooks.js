import { useEffect, useState } from "react";

export function usePromise(p) {
  const [data, setData] = useState(null);
  useEffect(() => {
    p.then((value) => setData(value));
  });
  return data;
}

export function navigate(to) {
  window.location.hash = to;
  return null;
}

export function useTitle(title) {
  useEffect(() => {
    const oldTitle = document.title;
    document.title = `${title} · Skin Explorer`;
    return () => void (document.title = oldTitle);
  }, [title]);
}
