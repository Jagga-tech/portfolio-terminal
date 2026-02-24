import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chanpreet Singh — Terminal Portfolio",
  description: "Product Manager & AI Builder. Explore my work through an interactive terminal experience.",
  keywords: ["Chanpreet Singh", "Product Manager", "AI", "Portfolio", "Terminal"],
  openGraph: {
    title: "Chanpreet Singh — Terminal Portfolio",
    description: "Product Manager & AI Builder. Type 'help' to explore.",
    url: "https://chanpreetsingh.tech",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
