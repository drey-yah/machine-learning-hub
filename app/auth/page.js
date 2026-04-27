'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const createProfile = async (user) => {
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      role: user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'user',
    })
  }

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage('Sign up error: ' + error.message)
      return
    }

    if (data.user) {
      await createProfile(data.user)
    }

    setMessage('Sign up successful. You may now log in.')
  }

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('Login error: ' + error.message)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Login / Sign Up</h1>

        <input
          className="w-full border p-2 mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignUp} className="bg-green-600 text-white px-4 py-2 mr-2">
          Sign Up
        </button>

        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2">
          Login
        </button>

        <p className="mt-4">{message}</p>
      </div>
    </main>
  )
}