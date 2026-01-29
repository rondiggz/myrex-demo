import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Eye, 
  Box, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Users, 
  Settings 
} from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'VISION', href: '/vision', icon: Eye },
    { name: 'Assets', href: '/assets', icon: Box },
    { name: 'Media Library', href: '/media', icon: BookOpen },
    { name: 'Marks Editor', href: '/marks', icon: MapPin },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
        {/* Mikron Logo - Top */}
        <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-center">
          <img src="/Mikron.png" alt="Mikron" className="h-10" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              placeholder="Search assets, marks, media, maintenance records..."
              className="w-full max-w-2xl bg-[#0a0a0a] text-white px-4 py-2 rounded-lg border border-[#2a2a2a] focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white text-xl">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              R
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}