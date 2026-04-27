'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ArticleDetailsPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchArticle()
    fetchComments()
    addView()
  }, [id])

  const fetchArticle = async () => {
    const { data } = await supabase.from('articles').select('*').eq('id', id).single()
    setArticle(data)
  }

  const addView = async () => {
    const { data } = await supabase.from('articles').select('views').eq('id', id).single()
    if (data) {
      await supabase.from('articles').update({ views: data.views + 1 }).eq('id', id)
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', id)
      .order('created_at', { ascending: true })

    setComments(data || [])
  }

  const addComment = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      alert('Please log in first.')
      return
    }

    await supabase.from('comments').insert({
      article_id: id,
      user_id: userData.user.id,
      comment,
    })

    setComment('')
    fetchComments()
  }

  const addReply = async (parentId) => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      alert('Please log in first.')
      return
    }

    await supabase.from('comments').insert({
      article_id: id,
      user_id: userData.user.id,
      parent_comment_id: parentId,
      comment: replyText,
    })

    setReplyText('')
    fetchComments()
  }

  const shareArticle = async () => {
    await navigator.clipboard.writeText(window.location.href)

    await supabase
      .from('articles')
      .update({ shares: article.shares + 1 })
      .eq('id', article.id)

    alert('Article link copied!')
    fetchArticle()
  }

  if (!article) return <p className="p-8">Loading...</p>

  const mainComments = comments.filter((c) => !c.parent_comment_id)

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <img src={article.image_url} className="w-full h-64 object-cover rounded" />

      <h1 className="text-3xl font-bold mt-4">{article.title}</h1>
      <p>Author: {article.author}</p>
      <p>Category: {article.category}</p>
      <p>Date: {article.publication_date}</p>
      <p className="my-4">{article.summary}</p>

      <a
        href={article.article_link}
        target="_blank"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Open Online Article
      </a>

      <button onClick={shareArticle} className="ml-2 bg-green-600 text-white px-4 py-2 rounded">
        Share
      </button>

      <h2 className="text-2xl font-bold mt-8">Comments</h2>

      <textarea
        className="w-full border p-2 mt-3"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button onClick={addComment} className="bg-blue-600 text-white px-4 py-2 mt-2">
        Comment
      </button>

      <div className="mt-6">
        {mainComments.map((c) => (
          <div key={c.id} className="border p-3 mb-3 rounded">
            <p>{c.comment}</p>

            <input
              className="border p-2 mt-2 w-full"
              placeholder="Reply..."
              onChange={(e) => setReplyText(e.target.value)}
            />

            <button onClick={() => addReply(c.id)} className="bg-gray-700 text-white px-3 py-1 mt-2">
              Reply
            </button>

            <div className="ml-6 mt-3">
              {comments
                .filter((r) => r.parent_comment_id === c.id)
                .map((reply) => (
                  <p key={reply.id} className="border-l pl-3 mb-2">
                    {reply.comment}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}