import { useEffect, useState } from 'react'
import { supabase, type CalendarEvent } from '../lib/supabase'
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Search, Filter, Eye } from 'lucide-react'

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) throw error

      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || event.event_type === filterType
    return matchesSearch && matchesFilter
  })

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      maintenance: 'from-orange-500 to-orange-600',
      inspection: 'from-yellow-500 to-yellow-600',
      training: 'from-purple-500 to-purple-600',
      meeting: 'from-blue-500 to-blue-600',
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  const getEventTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      maintenance: 'bg-orange-500 text-white',
      inspection: 'bg-yellow-500 text-black',
      training: 'bg-purple-500 text-white',
      meeting: 'bg-blue-500 text-white',
    }
    return colors[type] || 'bg-gray-500 text-white'
  }

  const eventTypes = [
    { id: 'all', label: 'All Events' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'inspection', label: 'Inspection' },
    { id: 'training', label: 'Training' },
    { id: 'meeting', label: 'Meetings' },
  ]

  const upcomingEvents = filteredEvents.filter(e => new Date(e.event_date) >= new Date())
  const pastEvents = filteredEvents.filter(e => new Date(e.event_date) < new Date())

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading Calendar...</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
            <p className="text-gray-400">Maintenance, training, and event scheduling</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2">
            <Plus size={20} />
            New Event
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1f37] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {eventTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                filterType === type.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-[#1a1f37] text-gray-400 hover:bg-[#252845]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Events</div>
          <div className="text-2xl font-bold text-white">{events.length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Upcoming</div>
          <div className="text-2xl font-bold text-blue-500">{upcomingEvents.length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">This Week</div>
          <div className="text-2xl font-bold text-green-500">
            {events.filter(e => {
              const eventDate = new Date(e.event_date)
              const weekFromNow = new Date()
              weekFromNow.setDate(weekFromNow.getDate() + 7)
              return eventDate >= new Date() && eventDate <= weekFromNow
            }).length}
          </div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Past</div>
          <div className="text-2xl font-bold text-gray-500">{pastEvents.length}</div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <CalendarIcon className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400 text-lg">
                {searchQuery || filterType !== 'all' ? 'No events match your filters' : 'No events scheduled'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Click "New Event" to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <CalendarIcon size={24} className="text-blue-500" />
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(event.event_date)
                    const isToday = eventDate.toDateString() === new Date().toDateString()
                    
                    return (
                      <div
                        key={event.id}
                        className={`group bg-[#1a1f37] rounded-xl p-6 border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${
                          isToday
                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'border-gray-800 hover:border-blue-500/50 hover:shadow-blue-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-6">
                          {/* Date Circle */}
                          <div className={`flex flex-col items-center shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${getEventTypeColor(event.event_type)} flex items-center justify-center shadow-lg`}>
                            <div className="text-2xl font-bold text-white leading-none">
                              {eventDate.getDate()}
                            </div>
                            <div className="text-xs text-white/80 uppercase leading-none mt-1">
                              {eventDate.toLocaleString('default', { month: 'short' })}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                                  {event.title}
                                </h3>
                                {event.description && (
                                  <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                                )}
                              </div>
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${getEventTypeBadgeColor(event.event_type)} shadow-lg whitespace-nowrap`}>
                                {event.event_type}
                              </span>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-400">
                              {event.event_time && (
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-blue-400" />
                                  <span>{event.event_time}</span>
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-green-400" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.linked_mark_id && (
                                <div className="flex items-center gap-2">
                                  <Eye size={16} className="text-purple-400" />
                                  <span className="text-purple-400">Linked to Vision mark</span>
                                </div>
                              )}
                            </div>

                            {isToday && (
                              <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm font-semibold">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                TODAY
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <CalendarIcon size={24} className="text-gray-500" />
                  Past Events
                </h2>
                <div className="space-y-3">
                  {pastEvents.slice(0, 5).map((event) => {
                    const eventDate = new Date(event.event_date)
                    
                    return (
                      <div
                        key={event.id}
                        className="group bg-[#1a1f37] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer opacity-60 hover:opacity-100"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex flex-col items-center shrink-0 w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center">
                            <div className="text-2xl font-bold text-white leading-none">
                              {eventDate.getDate()}
                            </div>
                            <div className="text-xs text-white/80 uppercase leading-none mt-1">
                              {eventDate.toLocaleString('default', { month: 'short' })}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="text-gray-300 font-bold text-base">
                                {event.title}
                              </h3>
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-semibold uppercase whitespace-nowrap">
                                {event.event_type}
                              </span>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              {event.event_time && (
                                <div className="flex items-center gap-2">
                                  <Clock size={14} />
                                  <span>{event.event_time}</span>
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
