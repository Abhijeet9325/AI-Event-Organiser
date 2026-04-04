"use client"

import React, { useState } from "react";
import { Toaster } from "sonner";

export default function SonnerToaster() {
  // Render only in the browser to avoid any DOM/portal initialization issues.
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) return null;

  return (
    <Toaster
      position="bottom-right"
      richColors
      expand
      offset={40}
      className="z-[9999]"
    />
  );
}

