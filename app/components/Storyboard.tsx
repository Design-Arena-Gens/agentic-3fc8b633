import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Trash2, Image as ImageIcon, Video, Music, GripVertical } from 'lucide-react'
import type { Scene, Asset } from '../page'

type StoryboardProps = {
  scenes: Scene[]
  onUpdateScene: (id: string, updates: Partial<Scene>) => void
  onMoveScene: (dragIndex: number, hoverIndex: number) => void
  onDeleteScene: (id: string) => void
  assets: Asset[]
}

type SceneCardProps = {
  scene: Scene
  index: number
  onUpdateScene: (id: string, updates: Partial<Scene>) => void
  onMoveScene: (dragIndex: number, hoverIndex: number) => void
  onDeleteScene: (id: string) => void
  assets: Asset[]
}

const ITEM_TYPE = 'SCENE'

function SceneCard({ scene, index, onUpdateScene, onMoveScene, onDeleteScene, assets }: SceneCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      onMoveScene(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  preview(drop(ref))

  const handleMediaDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const assetId = e.dataTransfer.getData('assetId')
    const asset = assets.find(a => a.id === assetId)

    if (asset && (asset.type === 'image' || asset.type === 'video')) {
      onUpdateScene(scene.id, {
        media: {
          type: asset.type,
          url: asset.url,
          name: asset.name
        }
      })
    } else if (asset && asset.type === 'audio') {
      onUpdateScene(scene.id, {
        voiceover: {
          url: asset.url,
          name: asset.name
        }
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div
      ref={ref}
      className={`bg-white border-2 border-primary-200 rounded-lg p-4 transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ cursor: 'move' }}
      role="article"
      aria-label={`Scene ${index + 1}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            ref={drag}
            className="cursor-move p-1 hover:bg-primary-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Drag to reorder scene"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5 text-primary-400" aria-hidden="true" />
          </button>
          <h3 className="font-semibold text-primary-900">Scene {index + 1}</h3>
          <span className="text-sm text-primary-500">({scene.duration}s)</span>
        </div>
        <button
          onClick={() => onDeleteScene(scene.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Delete scene ${index + 1}`}
          title="Delete Scene"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div
        className="mb-3 p-8 bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg flex items-center justify-center min-h-[150px]"
        onDrop={handleMediaDrop}
        onDragOver={handleDragOver}
        role="region"
        aria-label="Media drop zone"
      >
        {scene.media ? (
          <div className="relative w-full h-full">
            {scene.media.type === 'image' ? (
              <img
                src={scene.media.url}
                alt={scene.media.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Video className="w-12 h-12 text-primary-400" aria-hidden="true" />
                <span className="ml-2 text-sm text-primary-600">{scene.media.name}</span>
              </div>
            )}
            <button
              onClick={() => onUpdateScene(scene.id, { media: undefined })}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Remove media"
              title="Remove Media"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-primary-300 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-primary-600">Drop media here</p>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-sm text-primary-700 line-clamp-3">
          {scene.script || <span className="italic text-primary-400">No script</span>}
        </p>
      </div>

      {scene.voiceover && (
        <div className="flex items-center justify-between p-2 bg-primary-50 rounded border border-primary-200">
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-primary-600" aria-hidden="true" />
            <span className="text-sm text-primary-700">{scene.voiceover.name}</span>
          </div>
          <button
            onClick={() => onUpdateScene(scene.id, { voiceover: undefined })}
            className="p-1 text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Remove voiceover"
            title="Remove Voiceover"
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-primary-200">
        <div className="text-xs text-primary-500">
          Transition: <span className="font-medium text-primary-700 capitalize">{scene.transition}</span>
        </div>
      </div>
    </div>
  )
}

export default function Storyboard({ scenes, onUpdateScene, onMoveScene, onDeleteScene, assets }: StoryboardProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-900">Storyboard</h2>
        <p className="text-primary-600 mt-1">Visualize and arrange your scenes with drag-and-drop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            onUpdateScene={onUpdateScene}
            onMoveScene={onMoveScene}
            onDeleteScene={onDeleteScene}
            assets={assets}
          />
        ))}
      </div>

      {scenes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-primary-500">No scenes yet. Start by adding scenes in the Script Editor.</p>
        </div>
      )}
    </div>
  )
}
