import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FBR Digital Invoicing",
  description: "Secure workspace for digital invoicing and fiscalization.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
