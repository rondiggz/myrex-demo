import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Plus, Camera, Upload, Eye, EyeOff, Edit2, Trash2, Search, ChevronDown, ChevronRight, MousePointer2 } from 'lucide-react'

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

interface NewMark {
  position: { x: number; y: number; z: number }
  normal: { x: number; y: number; z: number }
  camera_position: any
  camera_rotation: any
  mattertag_id: string
}

export default function MarksEditor() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [sdk, setSdk] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [currentIntersection, setCurrentIntersection] = useState<any>(null)
  const [isMouseOverIframe, setIsMouseOverIframe] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newMark, setNewMark] = useState<NewMark | null>(null)
  const [selectedAsset] = useState<string>('BGfbBBXhrZf')
  const [marks, setMarks] = useState<Mark[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ maintenance: true, training: true, safety: true, uncategorized: true })
  const [categoryVisibility, setCategoryVisibility] = useState<Record<string, boolean>>({ maintenance: true, training: true, safety: true, uncategorized: true })
  
  // Form fields
  const [title, setTitle] = useState('New Mark 1')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('maintenance')
  const [keywords, setKeywords] = useState('')
  const [stemLength, setStemLength] = useState(0.3)

  useEffect(() => {
    // ...existing code...
  }, [])

  const loadMarks = async () => {
    try {
      console.log('[MARKS EDITOR] Loading marks for asset:', selectedAsset)
      
      const { data: assets, error: assetError } = await supabase
        .from('assets')
        .select('id')
        .eq('model_sid', selectedAsset)
        .limit(1)

      if (assetError) {
        console.error('[MARKS EDITOR] Asset query error:', assetError)
        return
      }

      if (!assets || assets.length === 0) {
        console.log('[MARKS EDITOR] No asset found, creating one...')
        const { data: newAsset, error: createError } = await supabase
          .from('assets')
          .insert({
            name: 'Mikron Demo',
            model_sid: selectedAsset,
            location: 'Trade Show Floor',
            status: 'active',
            manufacturer: 'Mikron'
          })
          .select()
          .single()
        
        if (createError) {
          console.error('[MARKS EDITOR] Error creating asset:', createError)
          return
        }
        
        console.log('[MARKS EDITOR] Created asset:', newAsset)
        // No marks yet for new asset
        return
      }

      const asset = assets[0]
      console.log('[MARKS EDITOR] Found asset:', asset)

      const { data, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('asset_id', asset.id)

      if (marksError) {
        console.error('[MARKS EDITOR] Marks query error:', marksError)
        return
      }

      console.log('[MARKS EDITOR] Loaded marks:', data)
      
      if (data) {
        setMarks(data.map(m => ({
          id: m.id,
          label: m.label,
          description: m.description || '',
          category: m.category || 'uncategorized',
          position_x: m.position_x,
          position_y: m.position_y,
          position_z: m.position_z,
          normal_x: m.normal_x,
          normal_y: m.normal_y,
          normal_z: m.normal_z,
          mattertag_id: m.mattertag_id,
          camera_position: m.camera_position,
          camera_rotation: m.camera_rotation,
          visible: true
        })))
        
        console.log('[MARKS EDITOR] Set marks state with', data.length, 'marks')
      }
    } catch (error) {
      console.error('[MARKS EDITOR] Error loading marks:', error)
    }
  }

  useEffect(() => {
    if (!sdk || !isReady) return
    
    const subscription = sdk.Pointer.intersection.subscribe((intersection: any) => {
      if (intersection && intersection.position) {
        setCurrentIntersection({
          position: intersection.position,
          normal: intersection.normal,
        })
      } else {
        setCurrentIntersection(null)
      }
    })

    return () => subscription.cancel()
  }, [sdk, isReady])

  // Handle RIGHT CLICK for mark placement
  useEffect(() => {
    if (!isAddMode || !sdk) return

    const handleContextMenu = async (e: MouseEvent) => {
      if (!isMouseOverIframe || !currentIntersection) return
      
      e.preventDefault()
      e.stopPropagation()
      
      const { position, normal } = currentIntersection

      try {
        // Use Mattertag.add (deprecated but works!)
        const tagIds = await sdk.Mattertag.add({
          label: title,
          description: 'Temporary mark',
          anchorPosition: position,
          stemVector: {
            x: normal.x * stemLength,
            y: normal.y * stemLength,
            z: normal.z * stemLength,
          },
          color: { r: 0.2, g: 0.8, b: 0.3 },
        })

        const cameraPose = await sdk.Camera.getPose()

        setNewMark({
          mattertag_id: tagIds[0],
          position,
          normal,
          camera_position: cameraPose.position,
          camera_rotation: cameraPose.rotation,
        })

        setShowSaveDialog(true)
        setIsAddMode(false)
      } catch (error) {
        console.error('[MARKS EDITOR] Failed to create mark:', error)
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [isAddMode, currentIntersection, sdk, isMouseOverIframe, title, stemLength])

  const handleSaveMark = async () => {
    if (!newMark) return

    try {
      let { data: assets } = await supabase
        .from('assets')
        .select('id')
        .eq('model_sid', selectedAsset)
        .limit(1)

      let asset = assets && assets.length > 0 ? assets[0] : null

      if (!asset) {
        const { data: newAsset } = await supabase
          .from('assets')
          .insert({
            name: 'Mikron Demo',
            model_sid: selectedAsset,
            location: 'Trade Show Floor',
            status: 'active',
            manufacturer: 'Mikron'
          })
          .select()
          .single()

        asset = newAsset
      }

      const { error } = await supabase
        .from('marks')
        .insert({
          asset_id: asset.id,
          label: title,
          description,
          category,
          position_x: newMark.position.x,
          position_y: newMark.position.y,
          position_z: newMark.position.z,
          normal_x: newMark.normal.x,
          normal_y: newMark.normal.y,
          normal_z: newMark.normal.z,
          camera_position: newMark.camera_position,
          camera_rotation: newMark.camera_rotation,
          mattertag_id: newMark.mattertag_id,
        })

      if (error) throw error

      console.log('[MARKS EDITOR] Mark saved successfully!')
      
      // Reload marks to update tree
      await loadMarks()
      
      setShowSaveDialog(false)
      setNewMark(null)
      setTitle('New Mark 1')
      setDescription('')
      setKeywords('')
      
      alert('Mark saved successfully!')
    } catch (error) {
      console.error('[MARKS EDITOR] Error:', error)
      alert('Failed to save: ' + JSON.stringify(error))
    }
  }

  const handleCancelSave = async () => {
    if (newMark && newMark.mattertag_id && sdk) {
      try {
        await sdk.Mattertag.remove(newMark.mattertag_id)
      } catch (error) {
        console.error('[MARKS EDITOR] Error removing mark:', error)
      }
    }
    setShowSaveDialog(false)
    setNewMark(null)
    setTitle('New Mark 1')
    setDescription('')
    setKeywords('')
  }

  const handleSetViewingAngle = async () => {
    if (!sdk) return
    try {
      const cameraPose = await sdk.Camera.getPose()
      if (newMark) {
        setNewMark({ ...newMark, camera_position: cameraPose.position, camera_rotation: cameraPose.rotation })
      }
      alert('Viewing angle captured!')
    } catch (error) {
      console.error('[MARKS EDITOR] Error capturing camera:', error)
    }
  }

  // Update stem length on existing mark (during placement OR after clicking slider)
  const handleStemLengthChange = async (newLength: number) => {
    setStemLength(newLength)
    
    if (newMark && sdk) {
      try {
        // Update the stem on the existing mark using Mattertag
        await sdk.Mattertag.editStem(newMark.mattertag_id, {
          x: newMark.normal.x * newLength,
          y: newMark.normal.y * newLength,
          z: newMark.normal.z * newLength,
        })
      } catch (error) {
        console.error('[MARKS EDITOR] Error updating stem:', error)
      }
    }
  }

  // Navigate to mark when clicked in tree
  const navigateToMark = async (mark: Mark) => {
    if (!sdk) return
    
    try {
      // Use Mattertag navigation (most reliable)
      if (mark.mattertag_id) {
        await sdk.Mattertag.navigateToTag(mark.mattertag_id, sdk.Mattertag.Transition.FLY)
        console.log('[MARKS EDITOR] Navigated to mark:', mark.label)
      }
    } catch (error) {
      console.error('[MARKS EDITOR] Error navigating to mark:', error)
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const toggleCategoryVisibility = (category: string) => {
    setCategoryVisibility(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const toggleMarkVisibility = (markId: string) => {
    setMarks(prev => prev.map(m => m.id === markId ? { ...m, visible: !m.visible } : m))
  }

  const deleteMark = async (markId: string) => {
    if (!confirm('Delete this mark?')) return
    
    try {
      await supabase.from('marks').delete().eq('id', markId)
      await loadMarks()
    } catch (error) {
      console.error('[MARKS EDITOR] Error deleting mark:', error)
    }
  }

  const categories = ['maintenance', 'training', 'safety', 'uncategorized']
  const filteredMarks = marks.filter(m => 
    m.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full overflow-hidden -m-6">
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-black border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-blue-500 font-bold text-xl">MARKS EDITOR</h2>
            <div className="flex gap-2">
              <button
                onClick={loadMarks}
                className="px-3 py-2 rounded-lg font-semibold transition-colors bg-gray-700 hover:bg-gray-600 text-white text-xs"
                title="Refresh marks"
              >
                ↻
              </button>
              <button
                onClick={() => setIsAddMode(!isAddMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isAddMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isAddMode ? 'CANCEL' : 'ADD MARK'}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 text-xs font-semibold">ASSET MARKS</span>
            <span className="text-blue-400 text-xs font-semibold">{marks.length} TOTAL</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search asset marks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white pl-9 pr-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {categories.map(category => {
            const categoryMarks = filteredMarks.filter(m => m.category === category)
            if (categoryMarks.length === 0) return null

            return (
              <div key={category} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    {expandedCategories[category] ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    <span className="text-white font-semibold uppercase text-xs">{category}</span>
                    <span className="text-gray-500 text-xs">({categoryMarks.length})</span>
                  </button>
                  <button
                    onClick={() => toggleCategoryVisibility(category)}
                    className="p-1 hover:bg-gray-800 rounded"
                  >
                    {categoryVisibility[category] ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-gray-600" />}
                  </button>
                </div>

                {expandedCategories[category] && (
                  <div className="ml-4 space-y-1">
                    {categoryMarks.map(mark => (
                      <div 
                        key={mark.id} 
                        onClick={() => navigateToMark(mark)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-900 rounded-lg group cursor-pointer"
                      >
                        <div className={`w-2 h-2 rounded-full ${mark.visible ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <span className="text-gray-300 text-xs flex-1 truncate">{mark.label}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                          <button onClick={(e) => { e.stopPropagation(); toggleMarkVisibility(mark.id); }} className="p-1 hover:bg-gray-700 rounded">
                            {mark.visible ? <Eye size={10} className="text-green-500" /> : <EyeOff size={10} className="text-gray-500" />}
                          </button>
                          <button onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-gray-700 rounded">
                            <Edit2 size={10} className="text-blue-500" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteMark(mark.id); }} className="p-1 hover:bg-gray-700 rounded">
                            <Trash2 size={10} className="text-red-500" />
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
      <div 
        className="flex-1 relative"
        onMouseEnter={() => setIsMouseOverIframe(true)}
        onMouseLeave={() => setIsMouseOverIframe(false)}
        onMouseMove={(e) => {
          if (isAddMode && cursorRef.current) {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            cursorRef.current.style.left = `${x}%`
            cursorRef.current.style.top = `${y}%`
          }
        }}
        onClick={(e) => { if (isAddMode) { e.preventDefault(); e.stopPropagation(); } }}
      >
        {isAddMode && !showSaveDialog && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-96 space-y-3">
            {/* Right-click instruction */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-2xl flex items-center justify-center gap-2 animate-pulse">
              <MousePointer2 size={20} />
              RIGHT-CLICK TO PLACE MARK
            </div>
            
            {/* Placement controls */}
            <div className="bg-blue-600 rounded-xl p-4 shadow-2xl">
              <h3 className="text-white font-bold text-center mb-3">PLACEMENT CONTROLS</h3>
              <p className="text-white/80 text-xs text-center mb-4">Adjust stem length • Pan to view • Zoom as needed</p>
              
              <div className="bg-blue-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-xs font-semibold">STEM LENGTH (meters)</span>
                  <span className="text-white text-sm font-bold">{stemLength.toFixed(2)}M</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={stemLength}
                  onChange={(e) => handleStemLengthChange(parseFloat(e.target.value))}
                  className="w-full h-3 bg-blue-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className={`h-full relative ${isAddMode ? 'ring-8 ring-blue-500/50 animate-pulse-ring' : ''}`}>
          {/* Floating cursor indicator - ABOVE iframe */}
          {isAddMode && (
            <div 
              ref={cursorRef}
              className="absolute pointer-events-none z-50"
              style={{ 
                left: '50%', 
                top: '50%',
                transform: 'translate(-16px, -48px)',
                transition: 'left 0.05s, top 0.05s'
              }}
            >
              <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0 C8 0 2 8 2 16 C2 24 16 48 16 48 S30 24 30 16 C30 8 24 0 16 0Z" fill="#00ff00" stroke="white" strokeWidth="2"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
              </svg>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={`/bundle/showcase.html?m=${selectedAsset}&play=1&qs=1&brand=0&mls=0&mt=0&tagNavigation=0&tagNavPanel=0&help=0&hr=0&applicationKey=76zueyye7kqqag4uxtw7kem5d`}
            className="w-full h-full border-none"
            allow="xr-spatial-tracking; camera; microphone"
            allowFullScreen
          />
        </div>

        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-lg font-semibold">Loading 3D Model...</div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT DIALOG */}
      {showSaveDialog && (
        <div className="w-96 h-full bg-[#1a1f37] border-l border-gray-700 flex flex-col shadow-2xl shrink-0">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between shrink-0">
            <h3 className="text-white font-bold text-base">Create Mark</h3>
            <button onClick={handleCancelSave} className="p-2 hover:bg-gray-800 rounded-lg">
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <button onClick={handleSetViewingAngle} className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Camera size={18} className="text-white" />
              <span className="text-white font-semibold text-sm">SET VIEWING ANGLE</span>
            </button>

            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1">TITLE *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1">DESCRIPTION</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/40 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-sm"
              />
            </div>

            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="maintenance">🔧 Maintenance</option>
                <option value="training">🎓 Training</option>
                <option value="safety">⚠️ Safety</option>
                <option value="uncategorized">📍 Uncategorized</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1">KEYWORDS</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-black/40 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-gray-300 text-xs font-medium block mb-1">UPLOAD MEDIA</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
                <Upload size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-white text-xs">Drag & drop files here</p>
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-lg border border-gray-700">
              <label className="text-gray-300 text-xs font-medium block mb-2">APPEARANCE</label>
              <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-600">
                <span className="text-2xl">💧</span>
                <span className="text-white text-sm font-medium">Choose Icon</span>
              </button>
            </div>
          </div>

          <div className="p-3 border-t border-gray-700 flex gap-2 shrink-0">
            <button onClick={handleCancelSave} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-sm">
              Cancel
            </button>
            <button onClick={handleSaveMark} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
              Save Mark
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.8), 0 0 0 16px rgba(59, 130, 246, 0.1); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}