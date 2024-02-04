import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "mesh.nav",
  description: "People get lost. We find them their way.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-violet-900 to-purple-950`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
