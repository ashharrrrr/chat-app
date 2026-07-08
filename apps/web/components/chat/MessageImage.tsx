"use client";

import { useState } from "react";

export function MessageImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {!loaded && (
        <div className="aspect-video w-full animate-pulse rounded-xl bg-neutral-700" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`
          ${loaded ? "block opacity-100" : "absolute opacity-0"}
          w-full
          max-h-80
          rounded-xl
          object-cover
          transition-opacity
          duration-300
        `}
      />
    </div>
  );
}

