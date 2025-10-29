'use client'

import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ScriptEditor from './components/ScriptEditor'
import Storyboard from './components/Storyboard'
import MediaAssets from './components/MediaAssets'
import ExportModal from './components/ExportModal'
import ConfirmModal from './components/ConfirmModal'

export type Scene = {
  id: string
  script: string
  duration: number
  media?: {
    type: 'image' | 'video'
    url: string
    name: string
  }
  voiceover?: {
    url: string
    name: string
  }
  transition: 'fade' | 'slide' | 'none'
}

export type Asset = {
  id: string
  type: 'image' | 'video' | 'audio'
  name: string
  url: string
  size: number
  thumbnail?: string
}

export default function Home() {
  const [scenes, setScenes] = useState<Scene[]>([
    { id: '1', script: '', duration: 5, transition: 'fade' }
  ])
  const [assets, setAssets] = useState<Asset[]>([])
  const [activeTab, setActiveTab] = useState<'script' | 'storyboard' | 'assets'>('script')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const [selectedScene, setSelectedScene] = useState<string>('1')

  const addScene = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      script: '',
      duration: 5,
      transition: 'fade'
    }
    setScenes([...scenes, newScene])
    setSelectedScene(newScene.id)
  }

  const updateScene = (id: string, updates: Partial<Scene>) => {
    setScenes(scenes.map(scene =>
      scene.id === id ? { ...scene, ...updates } : scene
    ))
  }

  const deleteScene = (id: string) => {
    if (scenes.length === 1) {
      setConfirmAction({
        title: 'Cannot Delete',
        message: 'You must have at least one scene in your project.',
        onConfirm: () => setShowConfirmModal(false)
      })
      setShowConfirmModal(true)
      return
    }

    setConfirmAction({
      title: 'Delete Scene',
      message: 'Are you sure you want to delete this scene? This action cannot be undone.',
      onConfirm: () => {
        setScenes(scenes.filter(scene => scene.id !== id))
        if (selectedScene === id) {
          setSelectedScene(scenes[0].id)
        }
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const moveScene = (dragIndex: number, hoverIndex: number) => {
    const newScenes = [...scenes]
    const [removed] = newScenes.splice(dragIndex, 1)
    newScenes.splice(hoverIndex, 0, removed)
    setScenes(newScenes)
  }

  const addAsset = (file: File) => {
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' :
                 file.type.startsWith('video/') ? 'video' : 'audio'

    const newAsset: Asset = {
      id: Date.now().toString(),
      type,
      name: file.name,
      url,
      size: file.size,
      thumbnail: type === 'image' ? url : undefined
    }

    setAssets([...assets, newAsset])
  }

  const deleteAsset = (id: string) => {
    setConfirmAction({
      title: 'Delete Asset',
      message: 'Are you sure you want to delete this asset? It will be removed from all scenes using it.',
      onConfirm: () => {
        setAssets(assets.filter(asset => asset.id !== id))
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleAIAssist = async (prompt: string) => {
    // Simulate AI assistance
    const suggestions = [
      "Opening with a compelling hook to grab viewer attention.",
      "Consider adding a transition scene here to maintain flow.",
      "This section could benefit from supporting visuals or B-roll footage.",
      "End with a clear call-to-action for maximum engagement."
    ]

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    return randomSuggestion
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white flex flex-col">
        <Header
          onExport={() => setShowExportModal(true)}
          onNewProject={() => {
            setConfirmAction({
              title: 'New Project',
              message: 'Creating a new project will discard all current work. Continue?',
              onConfirm: () => {
                setScenes([{ id: '1', script: '', duration: 5, transition: 'fade' }])
                setAssets([])
                setSelectedScene('1')
                setShowConfirmModal(false)
              }
            })
            setShowConfirmModal(true)
          }}
        />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <main className="flex-1 overflow-auto p-6" role="main">
            {activeTab === 'script' && (
              <ScriptEditor
                scenes={scenes}
                selectedScene={selectedScene}
                onSelectScene={setSelectedScene}
                onUpdateScene={updateScene}
                onAddScene={addScene}
                onDeleteScene={deleteScene}
                onAIAssist={handleAIAssist}
              />
            )}

            {activeTab === 'storyboard' && (
              <Storyboard
                scenes={scenes}
                onUpdateScene={updateScene}
                onMoveScene={moveScene}
                onDeleteScene={deleteScene}
                assets={assets}
              />
            )}

            {activeTab === 'assets' && (
              <MediaAssets
                assets={assets}
                onAddAsset={addAsset}
                onDeleteAsset={deleteAsset}
              />
            )}
          </main>
        </div>

        {showExportModal && (
          <ExportModal
            scenes={scenes}
            onClose={() => setShowExportModal(false)}
          />
        )}

        {showConfirmModal && confirmAction && (
          <ConfirmModal
            title={confirmAction.title}
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </DndProvider>
  )
}
