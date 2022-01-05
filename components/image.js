import NextImage from "next/image";
import { useState, useEffect } from "react";
import placeholder from "../assets/placeholder.svg";

export default function Image({ src, objectFit, ...props }) {
  const [exists, setExists] = useState(true);
  useEffect(() => setExists(true), [src]);

  let actualSrc = exists ? src : placeholder;

  return (
    <NextImage
      src={actualSrc}
      {...props}
      objectFit={exists ? objectFit : "contain"}
      onError={() => setExists(false)}
    />
  );
}
