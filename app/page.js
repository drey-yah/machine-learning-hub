'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function HomePage() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    fetchTopArticles()
  }, [])

  const fetchTopArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('views', { ascending: false })
      .limit(3)

    setArticles(data || [])
  }

  return (
    <main className="p-8">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold">Machine Learning Hub</h1>
        <p className="mt-3">Read, publish, and discuss Machine Learning articles.</p>

        <div className="mt-5">
          <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded">
            Login / Sign Up
          </Link>
        </div>
      </section>

      <h2 className="text-2xl font-bold mb-4">Top Articles</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-xl p-4 shadow">
            <img src={article.image_url} className="h-40 w-full object-cover rounded" />
            <h3 className="text-xl font-bold mt-3">{article.title}</h3>
            <p>{article.summary}</p>
            <Link href={`/articles/${article.id}`} className="text-blue-600">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}