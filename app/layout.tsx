import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { AdminProvider } from "@/context/admin-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TechTo.Earth - From Tech to Agriculture",
  description: "Helping tech professionals transition to farming, agriculture, restaurants, and manual jobs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <AdminProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
