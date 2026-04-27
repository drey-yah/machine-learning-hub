export const metadata = {
  title: 'Machine Learning Hub',
  description: 'A simple platform related to machine learning using Supabase and Vercel.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f4f4f4' }}>
        {children}
      </body>
    </html>
  )
}