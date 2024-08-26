import '@/styles/styles.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KYC',
  description: 'Know Your Cosigners'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
