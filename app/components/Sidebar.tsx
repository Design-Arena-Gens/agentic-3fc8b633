import { FileText, Layout, Image } from 'lucide-react'

type SidebarProps = {
  activeTab: 'script' | 'storyboard' | 'assets'
  onTabChange: (tab: 'script' | 'storyboard' | 'assets') => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'script' as const, label: 'Script', icon: FileText, description: 'Write and edit script' },
    { id: 'storyboard' as const, label: 'Storyboard', icon: Layout, description: 'Arrange scenes visually' },
    { id: 'assets' as const, label: 'Media', icon: Image, description: 'Manage assets' },
  ]

  return (
    <aside
      className="w-64 bg-primary-50 border-r border-primary-200 p-4"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      <nav className="space-y-2" role="navigation" aria-label="Section navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-start space-x-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-primary-700 hover:bg-primary-100'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${tab.label}: ${tab.description}`}
            >
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="text-left">
                <div className="font-semibold">{tab.label}</div>
                <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-100' : 'text-primary-500'}`}>
                  {tab.description}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      <div className="mt-8 p-4 bg-white rounded-lg border border-primary-200">
        <h3 className="text-sm font-semibold text-primary-900 mb-2">Tips</h3>
        <ul className="text-xs text-primary-600 space-y-2">
          <li>• Use keyboard shortcuts for faster editing</li>
          <li>• Drag and drop to reorder scenes</li>
          <li>• AI assistance available in script editor</li>
        </ul>
      </div>
    </aside>
  )
}
