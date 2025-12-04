import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./components/ProgressBarProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"], // Add desired weights
  variable: "--font-raleway" // Optional: Use CSS variable
});
export const metadata: Metadata = {
  title: "Project Play",
  description: "Padel and Pickelball court management and booking system",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/Favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html lang="en">
      <body className={`${raleway.variable} overflow-auto overflo-custom`}>
        <SessionProvider session={session}>
          <Providers>
          <Toaster richColors />
          <AppRouterCacheProvider>
            {children}
          </AppRouterCacheProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
