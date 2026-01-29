import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Users as UsersIcon, Search, Plus, Mail, Shield, User } from 'lucide-react'

interface UserType {
  id: string
  email: string
  name: string
  role: string
  organization?: string
  avatar_url?: string
  created_at: string
}

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500 text-white',
      manager: 'bg-purple-500 text-white',
      operator: 'bg-blue-500 text-white',
      user: 'bg-gray-500 text-white',
    }
    return colors[role] || 'bg-gray-500 text-white'
  }

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Shield size={14} />
    return <User size={14} />
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading Users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
            <p className="text-gray-400">Manage user access and permissions</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2">
            <Plus size={20} />
            Invite User
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1f37] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Users</div>
          <div className="text-2xl font-bold text-white">{users.length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Admins</div>
          <div className="text-2xl font-bold text-red-500">{users.filter(u => u.role === 'admin').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Operators</div>
          <div className="text-2xl font-bold text-blue-500">{users.filter(u => u.role === 'operator').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Users</div>
          <div className="text-2xl font-bold text-gray-500">{users.filter(u => u.role === 'user').length}</div>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <UsersIcon className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400 text-lg">
                {searchQuery ? 'No users match your search' : 'No users yet'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery ? 'Try a different search term' : 'Click "Invite User" to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group bg-[#1a1f37] rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
                        {user.name}
                      </h3>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold uppercase ${getRoleColor(user.role)} shadow-lg`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      
                      {user.organization && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <UsersIcon size={14} />
                          <span>{user.organization}</span>
                        </div>
                      )}

                      <div className="text-gray-500 text-xs">
                        Joined {new Date(user.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-colors">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}