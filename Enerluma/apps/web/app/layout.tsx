import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Enerluma | Smart Water & Energy Intelligence",
  description: "AI platform for utility forecasting, anomaly detection, and cost optimization.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
