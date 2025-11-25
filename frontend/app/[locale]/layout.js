import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { Toaster } from "sonner";
import ReduxProvider from "../redux-provider";
import DynamicFooter from "@/components/Footer/DynamicFooter";
import ConditionalNavbar from "@/components/Navbar/ConditionalNavbar";
import ConditionalChatbot from "@/components/chatbot/ConditionalChatbot";

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'hi' }];
}

export default async function LocaleLayout({ children, params }) {
  return children;
}
