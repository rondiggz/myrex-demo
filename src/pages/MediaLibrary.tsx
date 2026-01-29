import { useEffect, useState } from 'react'
import { supabase, type Media } from '../lib/supabase'
import { FileText, Video, Image, File, Search, Plus, Download, ExternalLink, Filter } from 'lucide-react'

export default function MediaLibrary() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setMedia(data || [])
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('video/')) return <Video size={32} className="text-purple-400" />
    if (fileType.startsWith('image/')) return <Image size={32} className="text-blue-400" />
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText size={32} className="text-red-400" />
    return <File size={32} className="text-gray-400" />
  }

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith('video/')) return 'from-purple-500 to-purple-600'
    if (fileType.startsWith('image/')) return 'from-blue-500 to-blue-600'
    if (fileType.includes('pdf') || fileType.includes('document')) return 'from-red-500 to-red-600'
    return 'from-gray-500 to-gray-600'
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const categories = [
    { id: 'all', label: 'All Files', icon: File },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'document', label: 'Documents', icon: FileText },
    { id: 'design', label: 'Design Files', icon: File },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading Media...</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
            <p className="text-gray-400">Videos, documents, design files, and photos</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2">
            <Plus size={20} />
            Upload Files
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search files by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1f37] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-[#1a1f37] text-gray-400 hover:bg-[#252845]'
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Files</div>
          <div className="text-2xl font-bold text-white">{media.length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Videos</div>
          <div className="text-2xl font-bold text-purple-500">{media.filter(m => m.category === 'video').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Images</div>
          <div className="text-2xl font-bold text-blue-500">{media.filter(m => m.category === 'image').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Documents</div>
          <div className="text-2xl font-bold text-red-500">{media.filter(m => m.category === 'document').length}</div>
        </div>
        <div className="bg-[#1a1f37] rounded-lg p-4 border border-gray-800">
          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Design Files</div>
          <div className="text-2xl font-bold text-green-500">{media.filter(m => m.category === 'design').length}</div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-auto">
        {filteredMedia.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <File className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400 text-lg">
                {searchQuery || filterCategory !== 'all' ? 'No files match your filters' : 'No media files yet'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery || filterCategory !== 'all' ? 'Try adjusting your search or filters' : 'Click "Upload Files" to get started'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="group bg-[#1a1f37] rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                {/* Preview */}
                <div className={`relative h-48 bg-gradient-to-br ${getFileTypeColor(item.file_type)} overflow-hidden`}>
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(item.file_type)}
                    </div>
                  )}
                  
                  {/* File Type Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold uppercase">
                      {item.file_type.split('/')[0]}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center gap-2 pb-4">
                    <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                      <ExternalLink size={18} />
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(item.file_size)}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}