import React from "react";

export default function StarRating({ value, onChange, size = "1rem" }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  return (
    <span className="stars" style={{ fontSize: size, cursor: interactive ? "pointer" : "default" }}>
      {stars.map((s) => (
        <span
          key={s}
          onClick={() => interactive && onChange(s)}
          role={interactive ? "button" : undefined}
          aria-label={interactive ? `Rate ${s} star${s > 1 ? "s" : ""}` : undefined}
        >
          {s <= value ? "\u2605" : "\u2606"}
        </span>
      ))}
    </span>
  );
}
