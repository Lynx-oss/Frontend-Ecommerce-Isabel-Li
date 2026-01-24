import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-cursive',
});

export const metadata = {
  title: "Isabel-Li | Moda Femenina Contemporánea",
  description: "Tienda de moda femenina con estilo elegante y atemporal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}