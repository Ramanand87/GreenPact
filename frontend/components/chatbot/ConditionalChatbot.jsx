"use client";

import { usePathname } from "next/navigation";
import AIChatbot from "./AIChatbot";

export default function ConditionalChatbot() {
  const pathname = usePathname(); // Get current route

  if (pathname.startsWith("/chat/")) {
    return null; // Hide footer for any chat username
  }

  return <AIChatbot />;
}
