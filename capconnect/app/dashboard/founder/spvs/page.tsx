import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { SPVCard } from '@/components/ui/spv-card'
import Link from 'next/link'

export default async function SPVsPage() {
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

  // Get SPVs for this company with member details
  const { data: spvs } = await supabase
    .from('spvs')
    .select(`
      *,
      spv_members (
        id,
        amount_committed,
        status,
        users (full_name, email)
      )
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const totalSPVs = spvs?.length || 0
  const activeSPVs = spvs?.filter(spv => spv.status === 'active').length || 0
  const totalCommitted = spvs?.reduce((sum, spv) => sum + (Number(spv.committed_amount) || 0), 0) || 0
  const totalMembers = spvs?.reduce((sum, spv) => sum + (spv.spv_members?.length || 0), 0) || 0

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation user={user} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SPVs</h1>
              <p className="text-gray-600 mt-1">
                Manage Special Purpose Vehicles for {company.name}
              </p>
            </div>
            <Link
              href="/dashboard/founder/spvs/create"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Create New SPV
            </Link>
          </div>

          {/* SPV Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-xl">🏗️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total SPVs</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSPVs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active SPVs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSPVs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Committed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalCommitted.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SPV List */}
          <div className="space-y-6">
            {spvs && spvs.length > 0 ? (
              spvs.map((spv: any) => (
                <SPVCard key={spv.id} spv={spv} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No SPVs created yet</h3>
                <p className="text-gray-600 mb-6">
                  Special Purpose Vehicles allow you to pool investor funds and simplify your cap table.
                </p>
                <Link
                  href="/dashboard/founder/spvs/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Your First SPV
                </Link>
              </div>
            )}
          </div>

          {/* SPV Benefits */}
          <div className="mt-12 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Why use SPVs?</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-medium text-gray-900 mb-2">Simplify Cap Table</h3>
                  <p className="text-sm text-gray-600">
                    Pool multiple investors into a single line item on your cap table
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-medium text-gray-900 mb-2">Faster Fundraising</h3>
                  <p className="text-sm text-gray-600">
                    Close with lead investor while others follow through the SPV
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🤝</div>
                  <h3 className="font-medium text-gray-900 mb-2">Investor Coordination</h3>
                  <p className="text-sm text-gray-600">
                    Let investors coordinate among themselves within the SPV structure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}