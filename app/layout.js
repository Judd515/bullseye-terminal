import './globals.css'

export const metadata = {
  title: 'BullsEye 🎯 Sentinel',
  description: 'AI-Driven Market Surveillance',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#09090b]">{children}</body>
    </html>
  )
}
