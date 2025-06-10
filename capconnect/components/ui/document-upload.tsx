'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface DocumentUploadProps {
  companyId: string
}

export function DocumentUpload({ companyId }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('pitch_deck')
  const [accessLevel, setAccessLevel] = useState('investors')
  const [documentName, setDocumentName] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }, [documentName])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const uploadDocument = async () => {
    if (!selectedFile || !documentName) return

    try {
      setUploading(true)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${companyId}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          company_id: companyId,
          name: documentName,
          type: documentType,
          url: publicUrl,
          file_size: selectedFile.size,
          access_level: accessLevel,
          uploaded_by: user.id
        })

      if (dbError) throw dbError

      // If it's a text-based document, extract content for embedding
      if (selectedFile.type.includes('text') || selectedFile.type.includes('pdf')) {
        await processDocumentForEmbedding(selectedFile, publicUrl)
      }

      // Reset form
      setSelectedFile(null)
      setDocumentName('')
      setDocumentType('pitch_deck')
      setAccessLevel('investors')
      
      router.refresh()
      alert('Document uploaded successfully!')
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Error uploading document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const processDocumentForEmbedding = async (file: File, documentUrl: string) => {
    try {
      // For MVP, we'll just extract basic text content
      // In production, you'd use a more sophisticated PDF parser
      const text = await file.text()
      
      // Chunk the text into smaller pieces
      const chunks = chunkText(text, 1000) // 1000 char chunks
      
      // Get embeddings from OpenAI (this would require a server endpoint)
      // For now, we'll just store the text chunks without embeddings
      const { data: document } = await supabase
        .from('documents')
        .select('id')
        .eq('url', documentUrl)
        .single()

      if (document) {
        const chunkInserts = chunks.map((chunk, index) => ({
          document_id: document.id,
          content: chunk,
          chunk_index: index
        }))

        await supabase
          .from('document_chunks')
          .insert(chunkInserts)
      }
    } catch (error) {
      console.error('Error processing document for embedding:', error)
      // Don't fail the upload if embedding fails
    }
  }

  const chunkText = (text: string, chunkSize: number): string[] => {
    const chunks = []
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize))
    }
    return chunks
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h2>
      
      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div>
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-2">☁️</div>
            <p className="text-sm font-medium text-gray-900">
              Drag and drop your document here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX, TXT files supported
            </p>
          </div>
        )}
        
        <input
          type="file"
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="file-upload"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          Select File
        </label>
      </div>

      {/* Document Details */}
      {selectedFile && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Name
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pitch_deck">Pitch Deck</option>
              <option value="term_sheet">Term Sheet</option>
              <option value="safe">SAFE Document</option>
              <option value="cap_table">Cap Table</option>
              <option value="financials">Financial Report</option>
              <option value="custom">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Access Level
            </label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="public">Public</option>
              <option value="investors">Investors Only</option>
              <option value="admins">Admins Only</option>
            </select>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={uploadDocument}
            disabled={uploading || !documentName}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      )}
    </div>
  )
}