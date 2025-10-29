import { Film, Download, FileText } from 'lucide-react'

type HeaderProps = {
  onExport: () => void
  onNewProject: () => void
}

export default function Header({ onExport, onNewProject }: HeaderProps) {
  return (
    <header className="bg-white border-b border-primary-200 px-6 py-4 shadow-sm" role="banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Film className="w-8 h-8 text-primary-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-primary-900">Script Video Generator</h1>
        </div>

        <nav className="flex items-center space-x-4" role="navigation" aria-label="Main navigation">
          <button
            onClick={onNewProject}
            className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Create new project"
          >
            <FileText className="w-5 h-5" aria-hidden="true" />
            <span>New Project</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Export video"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            <span>Export</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
