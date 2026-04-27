import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const article = await request.json()

    const { data: users } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'user')

    if (!users || users.length === 0) {
      return Response.json({ message: 'No users found.' })
    }

    for (const user of users) {
      await resend.emails.send({
        from: 'Machine Learning Hub <onboarding@resend.dev>',
        to: user.email,
        subject: `New ML Article Published: ${article.title}`,
        html: `
          <h2>${article.title}</h2>
          <p>${article.summary}</p>
          <a href="${article.article_link}">Read Article</a>
        `,
      })
    }

    return Response.json({ message: 'Emails sent successfully.' })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}