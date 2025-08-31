import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voice Shopping Assistant",
  description: "Voice-based shopping list manager with smart suggestions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
