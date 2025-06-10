import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { CapTableChart } from '@/components/ui/cap-table-chart'
import Link from 'next/link'

export default async function CapTablePage() {
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

  // Get share classes
  const { data: shareClasses } = await supabase
    .from('share_classes')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: true })

  // Get stakeholders with their securities
  const { data: stakeholders } = await supabase
    .from('stakeholders')
    .select(`
      *,
      securities (
        *,
        share_classes (name, class_type)
      )
    `)
    .eq('company_id', company.id)

  const totalShares = shareClasses?.reduce((sum, sc) => sum + Number(sc.outstanding_shares || 0), 0) || 0

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation user={user} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cap Table</h1>
              <p className="text-gray-600 mt-1">{company.name}</p>
            </div>
            <div className="space-x-4">
              <Link
                href="/dashboard/founder/cap-table/add-stakeholder"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Stakeholder
              </Link>
              <Link
                href="/dashboard/founder/cap-table/share-classes"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Manage Share Classes
              </Link>
            </div>
          </div>

          {/* Cap Table Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ownership Distribution</h2>
              {shareClasses && shareClasses.length > 0 ? (
                <CapTableChart data={shareClasses} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No share classes defined yet</p>
                  <Link
                    href="/dashboard/founder/cap-table/share-classes"
                    className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
                  >
                    Create your first share class
                  </Link>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Shares Outstanding</span>
                  <span className="font-medium">{totalShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Share Classes</span>
                  <span className="font-medium">{shareClasses?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stakeholders</span>
                  <span className="font-medium">{stakeholders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Classes Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Share Classes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price per Share
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shareClasses?.map((shareClass) => (
                    <tr key={shareClass.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shareClass.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {shareClass.class_type.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${shareClass.price_per_share || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Number(shareClass.total_shares || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Number(shareClass.outstanding_shares || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {totalShares > 0 
                          ? ((Number(shareClass.outstanding_shares || 0) / totalShares) * 100).toFixed(2)
                          : '0.00'
                        }%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!shareClasses || shareClasses.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No share classes created yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Stakeholders Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Stakeholders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equity %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Securities
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stakeholders?.map((stakeholder: any) => (
                    <tr key={stakeholder.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stakeholder.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {stakeholder.stakeholder_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stakeholder.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stakeholder.current_equity_percent || '0.00'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stakeholder.securities?.length || 0} securities
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!stakeholders || stakeholders.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No stakeholders added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}