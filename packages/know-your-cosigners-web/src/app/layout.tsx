import { StatisticsProvider } from '@/store'
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
      <body>
        <StatisticsProvider>
          {children}
        </StatisticsProvider>
      </body>
    </html>
  )
}
