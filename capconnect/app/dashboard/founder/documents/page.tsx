import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { DocumentUpload } from '@/components/ui/document-upload'
import { DocumentList } from '@/components/ui/document-list'

export default async function DocumentsPage() {
  const user = await requireAuth('founder')
  const supabase = createServerSupabaseClient()

  // Get user's company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company) {
    return <div>Company not found</div>
  }

  // Get documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const documentsByType = documents?.reduce((acc: any, doc) => {
    if (!acc[doc.type]) acc[doc.type] = []
    acc[doc.type].push(doc)
    return acc
  }, {}) || {}

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation user={user} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">
              Manage your company documents and investor data room
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <DocumentUpload companyId={company.id} />
          </div>

          {/* Documents Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {[
              { type: 'pitch_deck', label: 'Pitch Decks', icon: '📊', color: 'bg-blue-100 text-blue-800' },
              { type: 'term_sheet', label: 'Term Sheets', icon: '📋', color: 'bg-green-100 text-green-800' },
              { type: 'safe', label: 'SAFE Docs', icon: '🔒', color: 'bg-purple-100 text-purple-800' },
              { type: 'financials', label: 'Financials', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
              { type: 'custom', label: 'Other', icon: '📁', color: 'bg-gray-100 text-gray-800' },
            ].map((category) => (
              <div key={category.type} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{category.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {documentsByType[category.type]?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Document Lists by Type */}
          <div className="space-y-8">
            {Object.keys(documentsByType).length > 0 ? (
              Object.entries(documentsByType).map(([type, docs]: [string, any]) => (
                <div key={type} className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 capitalize">
                      {type.replace('_', ' ')} Documents
                    </h2>
                  </div>
                  <DocumentList documents={docs} />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
                <p className="text-gray-600 mb-4">
                  Start by uploading your pitch deck and other investor materials.
                </p>
              </div>
            )}
          </div>

          {/* Data Room Access */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Data Room Access</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {documents?.filter(d => d.access_level === 'public').length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Public Documents</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {documents?.filter(d => d.access_level === 'investors').length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Investor-Only Documents</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {documents?.filter(d => d.access_level === 'admins').length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Admin-Only Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}