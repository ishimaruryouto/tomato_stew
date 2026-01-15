import { Kiwi_Maru } from "next/font/google";
import "./globals.css";
import { CatThemeProvider } from "./providers/catThemeProvider";

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
        <CatThemeProvider>
          {children}
        </CatThemeProvider>
      </body>
    </html>
  );
}
