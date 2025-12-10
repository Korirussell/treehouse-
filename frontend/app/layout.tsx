import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Treehouse - Find Your Perfect Nature Escape',
  description: 'Discover unique treehouse stays in nature\'s most beautiful settings. Host your space with AI-powered listing descriptions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

