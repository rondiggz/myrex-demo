import { useEffect, useState } from 'react'
import { supabase, type Asset, type CalendarEvent } from '../lib/supabase'
import {
  ChevronLeft,
  ChevronRight,
  Package,
  FolderOpen,
  Wrench,
  GraduationCap,
  TrendingUp,
  Activity,
  Box as BoxIcon,
  MapPin,
  Clock
} from 'lucide-react'

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'notifications' | 'support'>('events')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: eventsData } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(4)

      setAssets(assetsData || [])
      setEvents(eventsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      maintenance: 'bg-orange-500 text-white',
      inspection: 'bg-yellow-500 text-black',
      training: 'bg-purple-500 text-white',
      meeting: 'bg-blue-500 text-white'
    }
    return colors[type] || 'bg-gray-500 text-white'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">

      {/* HERO SECTION */}
      <div className="grid grid-cols-2 gap-4 h-[420px]">

        {/* LEFT HERO */}
        <div className="relative bg-gradient-to-br from-[#3d4574] via-[#252845] to-[#3d4574] rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          {/* CAROUSEL BUTTONS */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 z-10 hover:scale-110 shadow-lg">
            <ChevronLeft size={20} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 z-10 hover:scale-110 shadow-lg">
            <ChevronRight size={20} />
          </button>

          {/* HERO CONTENT */}
          <div className="relative h-full p-12 flex flex-col justify-center">
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/50 flex items-center justify-center animate-float mb-6">
                <BoxIcon size={48} className="text-white" strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl font-bold text-white mb-3 leading-tight">Vision Layer</h1>
              <p className="text-gray-300 text-base mb-6 max-w-md leading-relaxed">
                Navigate your facility in immersive 3D. Create marks, track issues,
                and collaborate in real-time.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-xl hover:shadow-blue-500/50 hover:scale-105 duration-200">
                Explore Vision
              </button>
            </div>

            {/* CAROUSEL DOTS */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors cursor-pointer"></div>
              <div className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors cursor-pointer"></div>
            </div>
          </div>
        </div>

        {/* RIGHT TABS */}
        <div className="bg-[#1a1f37] rounded-2xl border border-gray-800 overflow-hidden shadow-xl flex flex-col">

          {/* TAB BUTTONS */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'events'
                  ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📅 Events
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'notifications'
                  ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🔔 Notifications
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'support'
                  ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              💬 Support
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-auto p-4">

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-3">
                {[
                  { date: 2, month: 'Feb', title: 'CNC Machine Maintenance', time: '9:00 AM', location: 'Production Floor', type: 'maintenance' },
                  { date: 3, month: 'Feb', title: 'Safety Inspection', time: '2:00 PM', location: 'Assembly Line A', type: 'inspection' },
                  { date: 4, month: 'Feb', title: 'Team Standup', time: '10:00 AM', location: 'Conference Room', type: 'meeting' },
                  { date: 5, month: 'Feb', title: 'Equipment Training', time: '1:00 PM', location: 'Training Center', type: 'training' }
                ].map((event, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-[#0f1425] transition-colors cursor-pointer">
                    <div className="text-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex flex-col items-center justify-center">
                        <div className="text-lg font-bold text-white leading-none">{event.date}</div>
                        <div className="text-[9px] text-gray-500 uppercase leading-none mt-0.5">{event.month}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">{event.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <Clock size={12} />
                        <span>{event.time}</span>
                        <span>•</span>
                        <MapPin size={12} />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-3">🔔</div>
                  <p className="text-gray-400">No new notifications</p>
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-gray-300 font-medium mb-1">Need Help?</p>
                  <p className="text-gray-500 text-sm">Our support team is here for you</p>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:scale-105">
                  Contact Support
                </button>
                <div className="space-y-2 pt-4 border-t border-gray-800">
                  <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">📘 Documentation</a>
                  <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">🎓 Training Videos</a>
                  <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">❓ FAQs</a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MAIN CONTENT BELOW HERO */}
      <div className="flex-1 overflow-auto space-y-4 pr-2">

        {/* QUICK ACCESS CARDS */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Package, title: 'Assets', subtitle: '3D Assets & Equipment', color: 'from-blue-500 to-blue-600' },
            { icon: FolderOpen, title: 'Media Library', subtitle: 'Videos, Docs, Design Files, Photos', color: 'from-green-500 to-green-600' },
            { icon: Wrench, title: 'Maintenance Hub', subtitle: 'Maintenance & Operations', color: 'from-purple-500 to-purple-600' },
            { icon: GraduationCap, title: 'Academy | Compliance', subtitle: 'Training & Compliance', color: 'from-yellow-500 to-yellow-600' }
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className="group bg-[#1a1f37] rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-tight">{item.subtitle}</p>
              </div>
            )
          })}
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-[65%_35%] gap-4">

          {/* IOT AT A GLANCE */}
          <div className="bg-[#1a1f37] rounded-xl border border-gray-800 overflow-hidden shadow-xl">

            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-base">IoT at a Glance</h2>
                <p className="text-gray-500 text-xs mt-0.5">Real-time equipment monitoring</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                <span className="text-green-400 text-sm font-semibold">Live</span>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 divide-x divide-gray-800">
              {[
                { label: 'OEE', value: '87.3%', change: '+2.1% from yesterday', icon: Activity, changeColor: 'text-green-500' },
                { label: 'Active Machines', value: '3/4', change: '1 in maintenance', icon: BoxIcon, changeColor: 'text-yellow-500' },
                { label: "Today's Output", value: '12,480', change: 'parts produced', icon: TrendingUp, changeColor: 'text-gray-500' },
                { label: 'System Status', value: 'Operational', change: 'All systems normal', icon: Activity, changeColor: 'text-gray-500', valueColor: 'text-green-500' }
              ].map((stat, i) => {
                const Icon = stat.icon
                return (
                  <div key={i} className="p-6 hover:bg-[#1e2442] transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={16} className="text-gray-600" />
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">{stat.label}</div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${stat.valueColor || 'text-white'}`}>{stat.value}</div>
                    <div className={`text-xs ${stat.changeColor}`}>{stat.change}</div>
                  </div>
                )
              })}
            </div>

            {/* PRODUCTION CHART */}
            <div className="p-6 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Production Output (24h)</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                    <span className="text-gray-500">Output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                    <span className="text-gray-500">Target</span>
                  </div>
                </div>
              </div>

              <div className="h-32 bg-[#0f1425] rounded-lg flex items-end justify-between px-3 pb-3 gap-1">
                                {Array.from({ length: 24 }).map((_, i) => {
                  const height = 30 + Math.random() * 70
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-500 hover:to-blue-300 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 animate-slideUp"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${i * 0.03}s`
                      }}
                    ></div>
                  )
                })}
              </div>

              <div className="flex justify-between text-xs text-gray-600 mt-3 px-3">
                <span>12AM</span>
                <span>6AM</span>
                <span>12PM</span>
                <span>6PM</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          {/* ASK VISION AI */}
          <div className="bg-[#1a1f37] rounded-xl border border-gray-800 p-6 shadow-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <span className="text-2xl">🤖</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold">Ask Vision AI</h3>
                  <div className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded uppercase tracking-wide shadow-lg shadow-green-500/50">
                    Live
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Your equipment expert</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                'How do I calibrate G05?',
                'Show maintenance schedule',
                'Find training videos'
              ].map((q, i) => (
                <button
                  key={i}
                  className="text-left px-4 py-3 bg-[#0f1425] hover:bg-[#1e2442] rounded-lg text-sm text-gray-400 transition-all duration-200 border border-transparent hover:border-blue-500/30 hover:text-gray-300 hover:shadow-lg"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideUp {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out backwards;
          transform-origin: bottom;
        }
      `}</style>
    </div>
  )
}
