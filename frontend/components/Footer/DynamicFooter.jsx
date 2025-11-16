"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function DynamicFooter() {
  const pathname = usePathname(); // Get current route

  if (pathname.startsWith("/chat/")) {
    return null; // Hide footer for any chat username
  }

  return <Footer />;
}
