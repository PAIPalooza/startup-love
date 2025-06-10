import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CapConnect - The smartest way to match capital with innovation',
  description: 'Streamline fundraising for founders and deal discovery for investors. Manage cap tables, SPVs, and investor relationships all in one platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}