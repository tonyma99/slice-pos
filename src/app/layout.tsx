import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import NavigationBar from "@/components/NavigationBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s - Menu`,
    default: "Menu",
  },
  description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <SessionProvider>
            <nav>
                <NavigationBar />
            </nav>
            <main>
                <div className="flex">
                    <div className="px-4 py-6 grow">
                        {children}
                    </div>
                </div>
            </main>
          </SessionProvider>
        </body>
      </html>
    );
}
