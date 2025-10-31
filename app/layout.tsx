import { Kiwi_Maru } from "next/font/google";
import "./globals.css";

const kiwimaru = Kiwi_Maru({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${kiwimaru.className} `}
      >
        {children}
      </body>
    </html>
  );
}
