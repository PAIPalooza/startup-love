'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Document {
  id: string
  name: string
  type: string
  url: string
  file_size: number
  access_level: string
  version: number
  created_at: string
}

interface DocumentListProps {
  documents: Document[]
}

export function DocumentList({ documents }: DocumentListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'bg-green-100 text-green-800'
      case 'investors':
        return 'bg-yellow-100 text-yellow-800'
      case 'admins':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pitch_deck':
        return '📊'
      case 'term_sheet':
        return '📋'
      case 'safe':
        return '🔒'
      case 'cap_table':
        return '📈'
      case 'financials':
        return '💰'
      default:
        return '📄'
    }
  }

  const handleDownload = async (document: Document) => {
    try {
      setLoading(document.id)
      
      // In a real app, you'd implement proper download tracking
      // and possibly generate signed URLs for security
      window.open(document.url, '_blank')
      
      // Log the download activity (for analytics)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            message: `Document "${document.name}" was downloaded`,
            type: 'view',
            related_id: document.id
          })
      }
    } catch (error) {
      console.error('Error downloading document:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) {
      return
    }

    try {
      setLoading(document.id)
      
      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id)

      if (error) throw error

      // Delete from storage (extract filename from URL)
      const fileName = document.url.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('documents')
          .remove([fileName])
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error deleting document. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No documents in this category yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Document
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Access Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Version
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((document) => (
            <tr key={document.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getDocumentIcon(document.type)}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {document.name}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {document.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelColor(document.access_level)}`}>
                  {document.access_level}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatFileSize(document.file_size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                v{document.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(document.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleDownload(document)}
                  disabled={loading === document.id}
                  className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                >
                  {loading === document.id ? 'Loading...' : 'Download'}
                </button>
                <button
                  onClick={() => handleDelete(document)}
                  disabled={loading === document.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}