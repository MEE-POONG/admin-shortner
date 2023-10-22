import type { Metadata } from 'next'
import { K2D } from 'next/font/google'
import './globals.css'
import Provider from '@/app/context/client-provider'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prompt = K2D({ weight: '400', subsets: ['latin-ext'] })

export const metadata: Metadata = {
  title: 'Customer Information',
  description: 'Customer Information By Short Link',
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang='en'>
      <body className={prompt.className}>
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  )
}
