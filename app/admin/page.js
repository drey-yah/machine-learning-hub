'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const router = useRouter()

  const [articles, setArticles] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push('/auth')
      return
    }

    await fetchData()
    setLoading(false)
  }

  const fetchData = async () => {
    const { data: articleData } = await supabase.from('articles').select('*')
    const { data: commentData } = await supabase.from('comments').select('*')
    const { data: userData } = await supabase.from('profiles').select('*')

    setArticles(articleData || [])
    setComments(commentData || [])
    setUsers(userData || [])
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Checking login...</p>
      </main>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <div className="border p-4 rounded shadow">
          <h2>Total Articles</h2>
          <p className="text-3xl font-bold">{articles.length}</p>
        </div>

        <div className="border p-4 rounded shadow">
          <h2>Total Comments</h2>
          <p className="text-3xl font-bold">{comments.length}</p>
        </div>

        <div className="border p-4 rounded shadow">
          <h2>Published Articles</h2>
          <p className="text-3xl font-bold">
            {articles.filter((a) => a.is_published).length}
          </p>
        </div>

        <div className="border p-4 rounded shadow">
          <h2>Total Users</h2>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/articles"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Manage Articles
        </Link>

        <Link
          href="/admin/users"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Manage Users
        </Link>
      </div>
    </main>
  )
}