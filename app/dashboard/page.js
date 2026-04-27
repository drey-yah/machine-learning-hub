'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [articles, setArticles] = useState([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('publication_date', { ascending: false })

    setArticles(data || [])
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? article.category === category : true
    return matchesSearch && matchesCategory
  })

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

      <input
        className="border p-2 mr-2"
        placeholder="Search articles..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select className="border p-2" onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option>Supervised Learning</option>
        <option>Unsupervised Learning</option>
        <option>Deep Learning</option>
        <option>Natural Language Processing</option>
        <option>Computer Vision</option>
        <option>Reinforcement Learning</option>
        <option>Neural Networks</option>
        <option>Model Evaluation</option>
        <option>Data Preprocessing</option>
        <option>AI Ethics</option>
      </select>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="border rounded-xl p-4 shadow">
            <img src={article.image_url} className="h-40 w-full object-cover rounded" />
            <h2 className="text-xl font-bold mt-2">{article.title}</h2>
            <p className="text-sm">{article.category}</p>
            <p>{article.summary}</p>
            <Link href={`/articles/${article.id}`} className="text-blue-600">
              Open Article
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}