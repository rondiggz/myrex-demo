import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Eye, EyeOff, Search, ChevronDown, ChevronRight, LogOut, FolderOpen, Calendar as CalendarIcon, Activity as ActivityIcon, BarChart, Wrench, MessageCircle } from 'lucide-react'

declare global {
  interface Window {
    MP_SDK: {
      connect: (
        showcase: Window,
        applicationKey?: string,
        sdkVersion?: string
      ) => Promise<any>
    }
  }
}

interface Mark {
  id: string
  label: string
  description: string
  category: string
  position_x: number
  position_y: number
  position_z: number
  normal_x: number
  normal_y: number
  normal_z: number
  mattertag_id?: string
  camera_position?: any
  camera_rotation?: any
  visible: boolean
}

type DrawerType = 'media' | 'events' | 'activity' | null

export default function Vision() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [sdk, setSdk] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [marks, setMarks] = useState<Mark[]>([])
  const [selectedAsset] = useState<string>('BGfbBBXhrZf')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ maintenance: true, training: true, safety: true, uncategorized: true })
  const [categoryVisibility, setCategoryVisibility] = useState<Record<string, boolean>>({ maintenance: true, training: true, safety: true, uncategorized: true })
  const [selectedMark, setSelectedMark] = useState<Mark | null>(null)
  const [showGrid, setShowGrid] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null)
  const [showAddMarkDialog, setShowAddMarkDialog] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [currentIntersection, setCurrentIntersection] = useState<any>(null)
  const [isMouseOverIframe, setIsMouseOverIframe] = useState(false)

  // Connect to Bundle SDK
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const onLoad = async () => {
      try {
        const showcaseWindow = iframe.contentWindow
        if (!showcaseWindow) return

        const mpSdk = await showcaseWindow.MP_SDK.connect(showcaseWindow, '76zueyye7kqqag4uxtw7kem5d', '')
        setSdk(mpSdk)

        await mpSdk.App.state.waitUntil((state: any) => state.phase === mpSdk.App.Phase.PLAYING)
        setIsReady(true)
        
        // Disable Matterport tag click popups
        try {
          await mpSdk.Mattertag.preventAction(mpSdk.Mattertag.Action.NAVIGATE)
          console.log('[VISION] Disabled Mattertag navigation popup')
        } catch (err) {
          console.warn('[VISION] Could not disable popup:', err)
        }
        
        // Load marks directly with mpSdk
        console.log('[VISION] Loading marks with SDK...')
        const tagData = await mpSdk.Mattertag.getData()
        console.log('[VISION] Loaded', tagData.length, 'tags')
        
        // Smart categorization based on tag names
        const categorizeTag = (label: string) => {
          const lower = label.toLowerCase()
          if (lower.includes('safety') || lower.includes('locking') || lower.includes('lock')) return 'safety'
          if (lower.includes('operator') || lower.includes('overview') || lower.includes('mini')) return 'training'
          if (lower.includes('station') || lower.includes('pallet') || lower.includes('inject') || lower.includes('cam') || lower.includes('machinery') || lower.includes('medical') || lower.includes('inhaler') || lower.includes('needle') || lower.includes('catheter')) return 'maintenance'
          return 'uncategorized'
        }
        
        // Make all tags GREEN - BRIGHT GREEN!
        console.log('[VISION] Coloring', tagData.length, 'tags green...')
        for (const tag of tagData) {
          try {
            await mpSdk.Mattertag.editColor(tag.sid, { r: 0.0, g: 1.0, b: 0.0 })
          } catch (err) {
            console.warn('[VISION] Could not color tag:', tag.sid, err)
          }
        }
        console.log('[VISION] All tags colored bright green!')
        
        const loadedMarks = tagData.map((tag: any) => ({
          id: tag.sid,
          label: tag.label || 'Unnamed Mark',
          description: tag.description || '',
          category: categorizeTag(tag.label || ''),
          mattertag_id: tag.sid,
          visible: true,
          position_x: tag.anchorPosition?.x || 0,
          position_y: tag.anchorPosition?.y || 0,
          position_z: tag.anchorPosition?.z || 0,
          normal_x: tag.stemVector?.x || 0,
          normal_y: tag.stemVector?.y || 0,
          normal_z: tag.stemVector?.z || 0,
          camera_position: null,
          camera_rotation: null
        }))
        
        setMarks(loadedMarks)
        console.log('[VISION] Categorized marks:', loadedMarks.map(m => ({ label: m.label, category: m.category })))
      } catch (error) {
        console.error('[VISION] Connection failed:', error)
      }
    }

    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [])

  const loadMarks = async () => {
    if (!sdk) {
      console.log('[VISION] SDK not ready yet')
      return
    }
    
    try {
      console.log('[VISION] Loading Matterport tags...')
      
      // Get tags directly from Matterport SDK
      const tagData = await sdk.Mattertag.getData()
      
      console.log('[VISION] Loaded', tagData.length, 'Matterport tags:', tagData)
      
      // Convert Matterport tags to our marks format
      const loadedMarks = tagData.map((tag: any) => ({
        id: tag.sid,
        label: tag.label || 'Unnamed Mark',
        description: tag.description || '',
        category: 'maintenance', // Default category
        mattertag_id: tag.sid,
        visible: true,
        position_x: tag.anchorPosition?.x || 0,
        position_y: tag.anchorPosition?.y || 0,
        position_z: tag.anchorPosition?.z || 0,
        normal_x: tag.stemVector?.x || 0,
        normal_y: tag.stemVector?.y || 0,
        normal_z: tag.stemVector?.z || 0,
        camera_position: null,
        camera_rotation: null
      }))
      
      setMarks(loadedMarks)
      console.log('[VISION] Set', loadedMarks.length, 'marks in state')
    } catch (error) {
      console.error('[VISION] Error loading marks:', error)
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const toggleCategoryVisibility = (category: string) => {
    setCategoryVisibility(prev => ({ ...prev, [category]: !prev[category] }))
    setMarks(prev => prev.map(m => m.category === category ? { ...m, visible: !categoryVisibility[category] } : m))
  }

  const toggleMarkVisibility = (markId: string) => {
    setMarks(prev => prev.map(m => m.id === markId ? { ...m, visible: !m.visible } : m))
  }

  const deleteMark = async (markId: string) => {
    if (!confirm('Delete this mark?')) return
    
    try {
      await supabase.from('marks').delete().eq('id', markId)
      setMarks(prev => prev.filter(m => m.id !== markId))
    } catch (error) {
      console.error('[VISION] Error deleting mark:', error)
    }
  }

  const handleMarkClick = async (mark: Mark) => {
    setSelectedMark(mark)
    setShowGrid(true)
    setActiveDrawer('media') // Default to media drawer
    
    // Navigate to the mark AND keep it green
    if (sdk && mark.mattertag_id) {
      try {
        await sdk.Mattertag.navigateToTag(mark.mattertag_id, sdk.Mattertag.Transition.FLY)
        // Force green on selected tag
        await sdk.Mattertag.editColor(mark.mattertag_id, { r: 0.0, g: 1.0, b: 0.0 })
        console.log('[VISION] Navigated to mark:', mark.label)
      } catch (error) {
        console.error('[VISION] Error navigating to mark:', error)
      }
    }
  }

  const handleGridClick = (type: DrawerType) => {
    setActiveDrawer(type)
  }

  const handleExit = () => {
    window.location.href = '/'
  }

  const categories = ['maintenance', 'training', 'safety', 'uncategorized']
  const filteredMarks = marks.filter(m => 
    m.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'maintenance': return '🔧'
      case 'training': return '🎓'
      case 'safety': return '⚠️'
      default: return '📍'
    }
  }

  return (
    <div className="flex h-full overflow-hidden -m-6">
      {/* LEFT SIDEBAR - MARKS EDITOR */}
      <div className="w-80 bg-black border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-800">
          <div className="mb-4">
            <h2 className="text-blue-500 font-bold text-xl">MYREX VISION</h2>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-blue-400 text-sm font-semibold">ASSET MARKS</span>
            <span className="text-blue-400 text-sm font-semibold">{marks.length} TOTAL</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search asset marks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white pl-9 pr-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {categories.map(category => {
            const categoryMarks = filteredMarks.filter(m => m.category === category)
            if (categoryMarks.length === 0) return null

            return (
              <div key={category} className="mb-4">
                <div className="flex items-center justify-between mb-2 group">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    {expandedCategories[category] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                    <span className="text-white font-semibold uppercase text-sm">{category}</span>
                    <span className="text-gray-500 text-xs">({categoryMarks.length})</span>
                  </button>
                  <button
                    onClick={() => toggleCategoryVisibility(category)}
                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                  >
                    {categoryVisibility[category] ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-600" />}
                  </button>
                </div>

                {expandedCategories[category] && (
                  <div className="ml-6 space-y-1">
                    {categoryMarks.map(mark => (
                      <div
                        key={mark.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-900 rounded-lg group transition-colors cursor-pointer"
                        onClick={() => handleMarkClick(mark)}
                      >
                        <div className={`w-2 h-2 rounded-full ${mark.visible ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <span className="text-gray-300 text-sm flex-1 truncate">{mark.label}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleMarkVisibility(mark.id); }}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            {mark.visible ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-gray-500" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CENTER - 3D VIEWER */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={`/bundle/showcase.html?m=${selectedAsset}&play=1&qs=1&brand=0&mls=0&mt=0&tagNavigation=0&tagNavPanel=0&help=0&hr=0&applicationKey=76zueyye7kqqag4uxtw7kem5d`}
          className="w-full h-full"
          allow="xr-spatial-tracking; camera; microphone"
          allowFullScreen
        />

        {/* TOP RIGHT CONTROLS */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleExit}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            <LogOut size={18} />
            EXIT SPACE
          </button>
          <button
            onClick={() => handleGridClick('media')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors ${activeDrawer === 'media' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
          >
            <FolderOpen size={18} />
            Media
          </button>
          <button
            onClick={() => handleGridClick('events')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors ${activeDrawer === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
          >
            <CalendarIcon size={18} />
            Events
          </button>
          <button
            onClick={() => handleGridClick('activity')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors ${activeDrawer === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
          >
            <ActivityIcon size={18} />
            Activity
          </button>
        </div>

        {/* 3x2 GRID (appears under selected mark) */}
        {showGrid && selectedMark && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl">
            {/* MARK TITLE */}
            <div className="text-center mb-4">
              <h3 className="text-white font-bold text-lg">{selectedMark.label}</h3>
              {selectedMark.description && (
                <p className="text-gray-400 text-sm mt-1">{selectedMark.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                onClick={() => handleGridClick('media')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors group"
              >
                <FolderOpen size={24} className="text-blue-400 group-hover:text-white" />
                <span className="text-xs text-gray-300 group-hover:text-white font-medium">Media</span>
              </button>
              <button
                onClick={() => handleGridClick('events')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-800 hover:bg-yellow-600 rounded-lg transition-colors group"
              >
                <CalendarIcon size={24} className="text-yellow-400 group-hover:text-white" />
                <span className="text-xs text-gray-300 group-hover:text-white font-medium">Events</span>
              </button>
              <button
                onClick={() => handleGridClick('activity')}
                className="flex flex-col items-center gap-2 p-4 bg-gray-800 hover:bg-purple-600 rounded-lg transition-colors group"
              >
                <ActivityIcon size={24} className="text-purple-400 group-hover:text-white" />
                <span className="text-xs text-gray-300 group-hover:text-white font-medium">Activity</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-800 opacity-40 cursor-not-allowed rounded-lg">
                <BarChart size={24} className="text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">IoT</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-800 opacity-40 cursor-not-allowed rounded-lg">
                <Wrench size={24} className="text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Maintenance</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-gray-800 opacity-40 cursor-not-allowed rounded-lg">
                <MessageCircle size={24} className="text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">Support</span>
              </button>
            </div>
          </div>
        )}

        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-lg font-semibold">Loading 3D Model...</div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT DRAWER */}
      {activeDrawer && (
        <div className="w-96 bg-black border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">
              {activeDrawer === 'media' && '📁 Media'}
              {activeDrawer === 'events' && '📅 Events'}
              {activeDrawer === 'activity' && '📋 Activity'}
            </h3>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {activeDrawer === 'media' && (
              <div className="space-y-4">
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <button className="w-full p-3 bg-gray-900 text-left flex items-center justify-between hover:bg-gray-800 transition-colors">
                    <span className="text-white font-semibold text-sm">📷 Photos (0)</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </div>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <button className="w-full p-3 bg-gray-900 text-left flex items-center justify-between hover:bg-gray-800 transition-colors">
                    <span className="text-white font-semibold text-sm">🎥 Videos (0)</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </div>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <button className="w-full p-3 bg-gray-900 text-left flex items-center justify-between hover:bg-gray-800 transition-colors">
                    <span className="text-white font-semibold text-sm">📄 Documents (0)</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
            {activeDrawer === 'events' && (
              <div className="text-center py-8 text-gray-400">
                <CalendarIcon size={48} className="mx-auto mb-3 opacity-30" />
                <p>No events linked to this mark</p>
              </div>
            )}
            {activeDrawer === 'activity' && (
              <div className="text-center py-8 text-gray-400">
                <ActivityIcon size={48} className="mx-auto mb-3 opacity-30" />
                <p>No activity yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD MARK DIALOG */}
      {showAddMarkDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Create Mark</h3>
              <button onClick={() => setShowAddMarkDialog(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <button className="w-full p-4 bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center justify-center gap-3 mb-6 transition-colors">
              <Camera size={20} className="text-white" />
              <span className="text-white font-semibold">SET VIEWING ANGLE</span>
            </button>

            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">TITLE *</label>
                <input
                  type="text"
                  placeholder="New Mark 1"
                  className="w-full bg-black text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Add details about this mark"
                  className="w-full bg-black text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">CATEGORY</label>
                <select className="w-full bg-black text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none">
                  <option>Maintenance</option>
                  <option>Training</option>
                  <option>Safety</option>
                  <option>Uncategorized</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddMarkDialog(false)}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}