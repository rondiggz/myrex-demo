import { useEffect, useState } from 'react'
import { supabase, type Asset } from '../lib/supabase'
import { Box, MapPin, Calendar, Activity, Search, Plus, Filter } from 'lucide-react'

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setAssets(data || [])
    } catch (error) {
      console.error('Error loading assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.location?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || asset.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white'
      case 'maintenance':
        return 'bg-yellow-500 text-black'
      case 'offline':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <Activity size={14} />
      case 'maintenance':
        return <Calendar size={14} />
      default:
        return <Box size={14} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading Assets...</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Assets</h1>
            <p className="text-gray-400">Manage your 3D assets and equipment</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2">
            <Plus size={20} />
            Add Asset
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search assets by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1f37] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-[#1a1f37] text-gray-400 hover:bg-[#252845]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                filterStatus === 'active'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-[#1a1f37] text-gray-400 hover:bg-[#252845]'
              }`}
            >
              <Activity size={16} />
              Active
            </button>
            <button
              onClick={() => setFilterStatus('maintenance')}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                filterStatus === 'maintenance'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-[#1a1f37] text-gray-400 hover:bg-[#252845]'
              }`}
            >
              <Calendar size={16} />
              Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Assets</div>
          <div className="text-2xl font-bold text-white">{assets.length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Active</div>
          <div className="text-2xl font-bold text-green-500">{assets.filter(a => a.status === 'active').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Maintenance</div>
          <div className="text-2xl font-bold text-yellow-500">{assets.filter(a => a.status === 'maintenance').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Offline</div>
          <div className="text-2xl font-bold text-red-500">{assets.filter(a => a.status === 'offline').length}</div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-auto">
        {filteredAssets.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Box className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400 text-lg">
                {searchQuery || filterStatus !== 'all' ? 'No assets match your filters' : 'No assets yet'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Click "Add Asset" to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-[#1a1f37] rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 overflow-hidden">
                  {asset.thumbnail_url ? (
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Box size={64} className="text-gray-700" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs ${getStatusColor(asset.status)} shadow-lg backdrop-blur-sm`}>
                      {getStatusIcon(asset.status)}
                      {asset.status || 'unknown'}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
                    <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
                      View in 3D
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-base mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {asset.name}
                  </h3>
                  
                  {asset.description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {asset.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {asset.location && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{asset.location}</span>
                      </div>
                    )}
                    
                    {asset.manufacturer && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Box size={14} className="flex-shrink-0" />
                        <span className="truncate">{asset.manufacturer}</span>
                      </div>
                    )}

                    {asset.serial_number && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <span className="font-mono">SN: {asset.serial_number}</span>
                      </div>
                    )}
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