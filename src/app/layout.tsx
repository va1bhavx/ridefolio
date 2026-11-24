import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Manrope } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" })
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const editorial = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
export const metadata: Metadata = {
  title: {
    default: "Ridefolio — Understand your ride. Own its story.",
    template: "%s | Ridefolio",
  },
  description:
    "Explore motorcycles, learn what makes them tick, and keep your ownership story in one place. An interactive demonstration.",
}
export const viewport: Viewport = { themeColor: "#176B5B" }
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${editorial.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
