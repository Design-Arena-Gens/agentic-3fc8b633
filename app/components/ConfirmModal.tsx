import { AlertTriangle, X } from 'lucide-react'

type ConfirmModalProps = {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" aria-hidden="true" />
            <h2 id="confirm-modal-title" className="text-xl font-bold text-primary-900">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close confirmation dialog"
          >
            <X className="w-5 h-5 text-primary-600" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p id="confirm-modal-description" className="text-primary-700">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-primary-200 bg-primary-50">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Cancel action"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Confirm action"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
