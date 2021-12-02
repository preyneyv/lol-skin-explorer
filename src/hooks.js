import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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

export function useEscapeTo(url) {
  const navigate = useNavigate();
  useEffect(() => {
    function onKeyDown(e) {
      console.log(e.code);
      if (e.code === "Escape") {
        navigate(url);
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navigate, url]);
}

export function useLocalStorageState(name, initialValue) {
  const [value, _setValue] = useState(
    localStorage[name] ? JSON.parse(localStorage[name]) : initialValue
  );
  const setValue = (v) => {
    _setValue(v);
    localStorage[name] = JSON.stringify(v);
  };
  return [value, setValue];
}
