import { useState } from 'react'
import { Plus, Trash2, Sparkles, Clock } from 'lucide-react'
import type { Scene } from '../page'

type ScriptEditorProps = {
  scenes: Scene[]
  selectedScene: string
  onSelectScene: (id: string) => void
  onUpdateScene: (id: string, updates: Partial<Scene>) => void
  onAddScene: () => void
  onDeleteScene: (id: string) => void
  onAIAssist: (prompt: string) => Promise<string>
}

export default function ScriptEditor({
  scenes,
  selectedScene,
  onSelectScene,
  onUpdateScene,
  onAddScene,
  onDeleteScene,
  onAIAssist
}: ScriptEditorProps) {
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const currentScene = scenes.find(s => s.id === selectedScene)

  const handleAIAssist = async () => {
    if (!currentScene) return

    setIsLoadingAI(true)
    try {
      const suggestion = await onAIAssist(currentScene.script)
      setAiSuggestion(suggestion)
    } catch (error) {
      console.error('AI assist failed:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-900">Script Editor</h2>
          <p className="text-primary-600 mt-1">Write and refine your video script with AI assistance</p>
        </div>
        <div className="flex items-center space-x-2 text-primary-700 bg-primary-50 px-4 py-2 rounded-lg">
          <Clock className="w-5 h-5" aria-hidden="true" />
          <span className="font-semibold">{totalDuration}s total</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Scene List */}
        <div className="col-span-3">
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-primary-900">Scenes</h3>
              <button
                onClick={onAddScene}
                className="p-1.5 hover:bg-primary-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Add new scene"
                title="Add Scene"
              >
                <Plus className="w-4 h-4 text-primary-700" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2" role="list" aria-label="Scene list">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => onSelectScene(scene.id)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    selectedScene === scene.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-700 hover:bg-primary-100'
                  }`}
                  aria-current={selectedScene === scene.id ? 'true' : undefined}
                  role="listitem"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Scene {index + 1}</span>
                    <span className="text-xs">{scene.duration}s</span>
                  </div>
                  <div className={`text-xs mt-1 truncate ${
                    selectedScene === scene.id ? 'text-primary-100' : 'text-primary-500'
                  }`}>
                    {scene.script || 'Empty'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-9 space-y-4">
          {currentScene && (
            <>
              <div className="bg-white border border-primary-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor="script-input" className="text-lg font-semibold text-primary-900">
                    Scene {scenes.findIndex(s => s.id === selectedScene) + 1} Script
                  </label>
                  <button
                    onClick={() => onDeleteScene(currentScene.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Delete current scene"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <textarea
                  id="script-input"
                  value={currentScene.script}
                  onChange={(e) => onUpdateScene(currentScene.id, { script: e.target.value })}
                  className="w-full h-64 px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-primary-900"
                  placeholder="Type your script here... Use AI assistance for suggestions and improvements."
                  aria-describedby="script-help"
                />
                <p id="script-help" className="sr-only">
                  Enter the script text for this scene. You can use the AI assistance button below for suggestions.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <label htmlFor={`duration-${currentScene.id}`} className="block text-sm font-medium text-primary-700 mb-1">
                        Duration (seconds)
                      </label>
                      <input
                        id={`duration-${currentScene.id}`}
                        type="number"
                        min="1"
                        max="60"
                        value={currentScene.duration}
                        onChange={(e) => onUpdateScene(currentScene.id, { duration: parseInt(e.target.value) || 5 })}
                        className="w-24 px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Scene duration in seconds"
                      />
                    </div>

                    <div>
                      <label htmlFor={`transition-${currentScene.id}`} className="block text-sm font-medium text-primary-700 mb-1">
                        Transition
                      </label>
                      <select
                        id={`transition-${currentScene.id}`}
                        value={currentScene.transition}
                        onChange={(e) => onUpdateScene(currentScene.id, { transition: e.target.value as Scene['transition'] })}
                        className="px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label="Scene transition effect"
                      >
                        <option value="none">None</option>
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAIAssist}
                    disabled={isLoadingAI}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    aria-label="Get AI script suggestions"
                  >
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                    <span>{isLoadingAI ? 'Thinking...' : 'AI Assist'}</span>
                  </button>
                </div>
              </div>

              {aiSuggestion && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" aria-hidden="true" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary-900 mb-2">AI Suggestion</h4>
                      <p className="text-primary-700 leading-relaxed">{aiSuggestion}</p>
                      <button
                        onClick={() => setAiSuggestion('')}
                        className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium focus:outline-none focus:underline"
                        aria-label="Dismiss AI suggestion"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
