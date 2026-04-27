'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ManageArticlesPage() {
  const router = useRouter()

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    title: '',
    author: '',
    summary: '',
    category: '',
    publication_date: '',
    image_url: '',
    article_link: '',
    is_published: true,
    is_featured: false,
  })

  useEffect(() => {
    checkLogin()
  }, [])

  // ✅ Only check if user is logged in (RBAC removed)
  const checkLogin = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push('/auth')
      return
    }

    await fetchArticles()
    setLoading(false)
  }

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage('Error loading articles: ' + error.message)
      return
    }

    setArticles(data || [])
  }

  const createArticle = async () => {
    setMessage('')

    if (
      !form.title ||
      !form.author ||
      !form.summary ||
      !form.category ||
      !form.publication_date ||
      !form.article_link
    ) {
      setMessage('Please fill in all required fields.')
      return
    }

    const { data: userData } = await supabase.auth.getUser()

    const { error } = await supabase.from('articles').insert({
      ...form,
      created_by: userData.user?.id,
    })

    if (error) {
      setMessage('Create article error: ' + error.message)
      return
    }

    if (form.is_published) {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }

    setForm({
      title: '',
      author: '',
      summary: '',
      category: '',
      publication_date: '',
      image_url: '',
      article_link: '',
      is_published: true,
      is_featured: false,
    })

    setMessage('Article published successfully!')
    fetchArticles()
  }

  const deleteArticle = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this article?')
    if (!confirmDelete) return

    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) {
      setMessage('Delete error: ' + error.message)
      return
    }

    setMessage('Article deleted successfully.')
    fetchArticles()
  }

  const updatePublishStatus = async (id, status) => {
    const { error } = await supabase
      .from('articles')
      .update({ is_published: status })
      .eq('id', id)

    if (error) {
      setMessage('Update error: ' + error.message)
      return
    }

    setMessage(status ? 'Article published.' : 'Article unpublished.')
    fetchArticles()
  }

  const updateFeaturedStatus = async (id, status) => {
    const { error } = await supabase
      .from('articles')
      .update({ is_featured: status })
      .eq('id', id)

    if (error) {
      setMessage('Featured update error: ' + error.message)
      return
    }

    setMessage(status ? 'Article marked as featured.' : 'Article removed from featured.')
    fetchArticles()
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
      <h1 className="text-3xl font-bold">Manage Articles</h1>

      {message && (
        <p className="mt-4 border p-3 rounded bg-gray-100">
          {message}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-3 mt-6">
        <input
          className="border p-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="border p-2"
          type="date"
          value={form.publication_date}
          onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Image / Banner URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Online Article Link"
          value={form.article_link}
          onChange={(e) => setForm({ ...form, article_link: e.target.value })}
        />

        <textarea
          className="border p-2 md:col-span-2"
          placeholder="Summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Publish immediately
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Mark as featured
        </label>
      </div>

      <button
        onClick={createArticle}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        Publish Article
      </button>

      <h2 className="text-2xl font-bold mt-8">Articles</h2>

      {articles.map((article) => (
        <div key={article.id} className="border p-4 rounded mt-3">
          <h3 className="font-bold">{article.title}</h3>
          <p>Category: {article.category}</p>
          <p>Published: {article.is_published ? 'Yes' : 'No'}</p>
          <p>Featured: {article.is_featured ? 'Yes' : 'No'}</p>
          <p>
            Views: {article.views} | Shares: {article.shares} | Likes: {article.likes}
          </p>

          <div className="mt-3">
            <button
              onClick={() => updatePublishStatus(article.id, !article.is_published)}
              className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
            >
              {article.is_published ? 'Unpublish' : 'Publish'}
            </button>

            <button
              onClick={() => updateFeaturedStatus(article.id, !article.is_featured)}
              className="bg-purple-600 text-white px-3 py-1 mr-2 rounded"
            >
              {article.is_featured ? 'Remove Featured' : 'Feature'}
            </button>

            <button
              onClick={() => deleteArticle(article.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </main>
  )
}