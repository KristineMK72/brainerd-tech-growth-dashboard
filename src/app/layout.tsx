import "./globals.css";

export const metadata = {
  title: "Brainerd Lakes Tech Growth Dashboard",
  description:
    "Economic and technology growth insights for the Brainerd Lakes region",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
