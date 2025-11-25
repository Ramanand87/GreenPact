import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ReduxProvider from "./redux-provider";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";
import DynamicFooter from "@/components/Footer/DynamicFooter";
import ConditionalNavbar from "@/components/Navbar/ConditionalNavbar";
import ConditionalChatbot from "@/components/chatbot/ConditionalChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GreenPact",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} `} suppressHydrationWarning>
        <LanguageProvider>
          <ReduxProvider>
            <ConditionalNavbar/>
            <main className="">{children}</main>
            <ConditionalChatbot/>
            <DynamicFooter/>
          </ReduxProvider>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
