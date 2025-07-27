import type React from "react"
import type { Metadata } from "next"
import { Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
})

export const metadata: Metadata = {
  title: "Crypto Currency Tracker",
  description: "Real-time cryptocurrency tracking with multi-currency conversion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} font-sora`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
