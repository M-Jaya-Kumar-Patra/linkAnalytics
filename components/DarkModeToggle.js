"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-3 py-1 rounded-md text-sm border
      border-gray-300 dark:border-gray-700
      hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
