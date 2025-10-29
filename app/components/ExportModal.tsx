import { useState } from 'react'
import { X, Download, Loader2, CheckCircle } from 'lucide-react'
import type { Scene } from '../page'

type ExportModalProps = {
  scenes: Scene[]
  onClose: () => void
}

type ExportSettings = {
  resolution: '1080p' | '720p' | '480p'
  format: 'mp4' | 'mov'
  quality: 'high' | 'medium' | 'low'
  includeWatermark: boolean
  watermarkText: string
  brandingLogo: boolean
}

export default function ExportModal({ scenes, onClose }: ExportModalProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    resolution: '1080p',
    format: 'mp4',
    quality: 'high',
    includeWatermark: false,
    watermarkText: '',
    brandingLogo: false
  })

  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          setExportComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="export-modal-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200">
          <h2 id="export-modal-title" className="text-2xl font-bold text-primary-900">
            Export Video
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close export modal"
          >
            <X className="w-6 h-6 text-primary-600" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!exportComplete ? (
            <>
              {/* Project Info */}
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2">Project Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-primary-600">Total Scenes:</span>
                    <span className="ml-2 font-medium text-primary-900">{scenes.length}</span>
                  </div>
                  <div>
                    <span className="text-primary-600">Duration:</span>
                    <span className="ml-2 font-medium text-primary-900">{totalDuration}s</span>
                  </div>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label htmlFor="resolution" className="block text-sm font-semibold text-primary-900 mb-2">
                  Resolution
                </label>
                <select
                  id="resolution"
                  value={settings.resolution}
                  onChange={(e) => setSettings({ ...settings, resolution: e.target.value as ExportSettings['resolution'] })}
                  className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isExporting}
                  aria-describedby="resolution-help"
                >
                  <option value="1080p">1080p (1920x1080) - Full HD</option>
                  <option value="720p">720p (1280x720) - HD</option>
                  <option value="480p">480p (854x480) - SD</option>
                </select>
                <p id="resolution-help" className="text-xs text-primary-500 mt-1">
                  Higher resolutions provide better quality but larger file sizes
                </p>
              </div>

              {/* Format */}
              <div>
                <label htmlFor="format" className="block text-sm font-semibold text-primary-900 mb-2">
                  Format
                </label>
                <select
                  id="format"
                  value={settings.format}
                  onChange={(e) => setSettings({ ...settings, format: e.target.value as ExportSettings['format'] })}
                  className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isExporting}
                >
                  <option value="mp4">MP4 (H.264) - Universal compatibility</option>
                  <option value="mov">MOV (QuickTime) - High quality</option>
                </select>
              </div>

              {/* Quality */}
              <div>
                <label htmlFor="quality" className="block text-sm font-semibold text-primary-900 mb-2">
                  Quality
                </label>
                <div className="flex space-x-3">
                  {(['high', 'medium', 'low'] as const).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setSettings({ ...settings, quality })}
                      disabled={isExporting}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        settings.quality === quality
                          ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                          : 'border-primary-200 text-primary-700 hover:bg-primary-50'
                      }`}
                      aria-pressed={settings.quality === quality}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="watermark"
                    type="checkbox"
                    checked={settings.includeWatermark}
                    onChange={(e) => setSettings({ ...settings, includeWatermark: e.target.checked })}
                    disabled={isExporting}
                    className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="watermark" className="ml-2 text-sm font-semibold text-primary-900">
                    Include Watermark
                  </label>
                </div>

                {settings.includeWatermark && (
                  <input
                    type="text"
                    value={settings.watermarkText}
                    onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })}
                    placeholder="Enter watermark text"
                    disabled={isExporting}
                    className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Watermark text"
                  />
                )}
              </div>

              {/* Branding */}
              <div className="flex items-center">
                <input
                  id="branding"
                  type="checkbox"
                  checked={settings.brandingLogo}
                  onChange={(e) => setSettings({ ...settings, brandingLogo: e.target.checked })}
                  disabled={isExporting}
                  className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="branding" className="ml-2 text-sm font-semibold text-primary-900">
                  Include Branding Logo
                </label>
              </div>

              {/* Progress */}
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-700 font-medium">Exporting...</span>
                    <span className="text-primary-600">{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-primary-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${exportProgress}%` }}
                      role="progressbar"
                      aria-valuenow={exportProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Export progress"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Export Complete */
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-primary-900 mb-2">Export Complete!</h3>
              <p className="text-primary-600 mb-6">
                Your video has been successfully exported and is ready to download.
              </p>
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200 inline-block">
                <p className="text-sm text-primary-700">
                  <span className="font-semibold">Format:</span> {settings.format.toUpperCase()}
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Resolution:</span> {settings.resolution}
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Size:</span> ~{(totalDuration * 0.5).toFixed(1)} MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-primary-200 bg-primary-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isExporting}
          >
            {exportComplete ? 'Close' : 'Cancel'}
          </button>

          {!exportComplete && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Start export"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" aria-hidden="true" />
                  <span>Export Video</span>
                </>
              )}
            </button>
          )}

          {exportComplete && (
            <button
              onClick={() => {
                // Simulate download
                console.log('Downloading video...')
              }}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Download exported video"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
