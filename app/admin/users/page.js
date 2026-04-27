'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ManageUsersPage() {
  const router = useRouter()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push('/auth')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    fetchUsers()
    setLoading(false)
  }

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*')
    setUsers(data || [])
  }

  const updateRole = async (id, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id)

    if (error) {
      setMessage('Error updating role: ' + error.message)
      return
    }

    setMessage('Role updated successfully')
    fetchUsers()
  }

  const deleteUser = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this user?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage('Delete error: ' + error.message)
      return
    }

    setMessage('User deleted successfully')
    fetchUsers()
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Manage Users</h1>

      {message && <p className="mt-3">{message}</p>}

      {users.map((user) => (
        <div key={user.id} className="border p-4 mt-3 rounded">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <div className="mt-2">
            <button
              onClick={() => updateRole(user.id, 'admin')}
              className="bg-blue-600 text-white px-3 py-1 mr-2"
            >
              Make Admin
            </button>

            <button
              onClick={() => updateRole(user.id, 'user')}
              className="bg-gray-600 text-white px-3 py-1 mr-2"
            >
              Make User
            </button>

            <button
              onClick={() => deleteUser(user.id)}
              className="bg-red-600 text-white px-3 py-1"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </main>
  )
}