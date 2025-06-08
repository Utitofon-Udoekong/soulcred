import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "./providers/Web3Provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoulCred - On-Chain Resume Builder",
  description: "Build and verify your professional history on the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          
        {children}
        </Web3Provider>
      </body>
    </html>
  );
}
