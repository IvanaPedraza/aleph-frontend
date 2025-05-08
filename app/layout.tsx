import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aleph - Música y Cultura",
  description: "Descubre las últimas novedades en música y cultura",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <div className="h-20"></div> {/* Espaciador para compensar el navbar fijo */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
