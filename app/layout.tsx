import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Erickson Coaching Greece — Campaign Brief | Promoters",
  description: "Σύντομο questionnaire για τον σχεδιασμό της καμπάνιας του Erickson Coaching Greece.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
