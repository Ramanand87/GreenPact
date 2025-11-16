import { Inter } from "next/font/google";
import { Poppins } from "@next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "./redux-provider";
import { Navbar } from "@/components/Navbar/Navbar";

import "./globals.css";
import Footer from "@/components/Footer/Footer";
import DynamicFooter from "@/components/Footer/DynamicFooter";
import AIChatbot from "@/components/chatbot/AIChatbot";
import ConditionalNavbar from "@/components/Navbar/ConditionalNavbar";
import ConditionalChatbot from "@/components/chatbot/ConditionalChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GreenPact",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <ReduxProvider>
          <ConditionalNavbar/>
          <main className="">{children}</main>
          <ConditionalChatbot/>
          <DynamicFooter/>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
