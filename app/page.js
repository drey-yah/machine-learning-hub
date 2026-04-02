import Link from 'next/link'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '10px', color: '#222' }}>Machine Learning Hub</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Welcome to Machine Learning Hub, a simple platform where users can sign up
          and log in to explore a basic machine learning-themed web application.
        </p>

        <Link
          href="/auth"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          Go to Login / Sign Up
        </Link>
      </div>
    </main>
  )
}