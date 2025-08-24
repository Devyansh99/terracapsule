import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TerraCapsule",
  description: "Interactive 3D Travel Experience",
  icons: {
    icon: '/terracapsule.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body className="bg-black text-white font-sans antialiased overflow-x-hidden min-h-screen">
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
