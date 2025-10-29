import { useRef } from 'react'
import { Upload, Image as ImageIcon, Video, Music, Trash2, HardDrive } from 'lucide-react'
import type { Asset } from '../page'

type MediaAssetsProps = {
  assets: Asset[]
  onAddAsset: (file: File) => void
  onDeleteAsset: (id: string) => void
}

export default function MediaAssets({ assets, onAddAsset, onDeleteAsset }: MediaAssetsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        onAddAsset(file)
      })
    }
    // Reset input
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files) {
      Array.from(files).forEach(file => {
        onAddAsset(file)
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return ImageIcon
      case 'video':
        return Video
      case 'audio':
        return Music
      default:
        return HardDrive
    }
  }

  const handleDragStart = (e: React.DragEvent, assetId: string) => {
    e.dataTransfer.setData('assetId', assetId)
  }

  const images = assets.filter(a => a.type === 'image')
  const videos = assets.filter(a => a.type === 'video')
  const audios = assets.filter(a => a.type === 'audio')

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary-900">Media Assets</h2>
        <p className="text-primary-600 mt-1">Upload and manage your images, videos, and audio files</p>
      </div>

      {/* Upload Area */}
      <div
        className="mb-8 p-12 bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg text-center cursor-pointer hover:bg-primary-100 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload media files"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click()
          }
        }}
      >
        <Upload className="w-16 h-16 text-primary-400 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-primary-900 mb-2">Upload Media</h3>
        <p className="text-primary-600 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-sm text-primary-500">
          Supported: Images (JPG, PNG, GIF), Videos (MP4, MOV), Audio (MP3, WAV)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="File input for media upload"
        />
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="text-center py-12">
          <HardDrive className="w-16 h-16 text-primary-300 mx-auto mb-4" aria-hidden="true" />
          <p className="text-primary-500">No assets uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Images */}
          {images.length > 0 && (
            <section aria-labelledby="images-heading">
              <h3 id="images-heading" className="text-xl font-semibold text-primary-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Images ({images.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map(asset => {
                  const Icon = getAssetIcon(asset.type)
                  return (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset.id)}
                      className="group relative bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-move"
                      role="article"
                      aria-label={`Image: ${asset.name}`}
                    >
                      <div className="aspect-video bg-primary-100 flex items-center justify-center">
                        {asset.thumbnail ? (
                          <img
                            src={asset.thumbnail}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="w-12 h-12 text-primary-400" aria-hidden="true" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-primary-900 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <p className="text-xs text-primary-500 mt-1">{formatFileSize(asset.size)}</p>
                      </div>
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${asset.name}`}
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <section aria-labelledby="videos-heading">
              <h3 id="videos-heading" className="text-xl font-semibold text-primary-900 mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2" aria-hidden="true" />
                Videos ({videos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map(asset => {
                  const Icon = getAssetIcon(asset.type)
                  return (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset.id)}
                      className="group relative bg-white border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-move"
                      role="article"
                      aria-label={`Video: ${asset.name}`}
                    >
                      <div className="aspect-video bg-primary-100 flex items-center justify-center">
                        <Icon className="w-12 h-12 text-primary-400" aria-hidden="true" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-primary-900 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <p className="text-xs text-primary-500 mt-1">{formatFileSize(asset.size)}</p>
                      </div>
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${asset.name}`}
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Audio */}
          {audios.length > 0 && (
            <section aria-labelledby="audio-heading">
              <h3 id="audio-heading" className="text-xl font-semibold text-primary-900 mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" aria-hidden="true" />
                Audio ({audios.length})
              </h3>
              <div className="space-y-2">
                {audios.map(asset => {
                  const Icon = getAssetIcon(asset.type)
                  return (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset.id)}
                      className="group flex items-center justify-between p-4 bg-white border border-primary-200 rounded-lg hover:shadow-lg transition-all cursor-move"
                      role="article"
                      aria-label={`Audio: ${asset.name}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8 text-primary-400" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-primary-900">{asset.name}</p>
                          <p className="text-xs text-primary-500">{formatFileSize(asset.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${asset.name}`}
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
