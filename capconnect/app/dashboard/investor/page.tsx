import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import Link from 'next/link'

interface Props {
  searchParams: { demo?: string }
}

export default async function InvestorDashboard({ searchParams }: Props) {
  const isDemo = searchParams.demo === 'true'
  
  let user, investments, totalInvested, spvMemberships, recentCompanies
  
  if (isDemo) {
    // Demo mode with mock data
    user = createDemoUser('investor')
    investments = [
      {
        id: '1',
        amount: 25000,
        instrument: 'SAFE',
        status: 'committed',
        companies: { name: 'Demo Startup A', stage: 'seed', industry: 'fintech' }
      },
      {
        id: '2',
        amount: 50000,
        instrument: 'Equity',
        status: 'committed', 
        companies: { name: 'Demo Startup B', stage: 'series-a', industry: 'healthtech' }
      }
    ]
    totalInvested = 75000
    spvMemberships = [
      { id: '1', spvs: { name: 'Fintech SPV', companies: { name: 'Demo Startup A' } } }
    ]
    recentCompanies = [
      {
        id: '1',
        name: 'Demo Company 1',
        industry: 'fintech',
        stage: 'seed',
        description: 'Revolutionary fintech platform',
        target_raise: 500000
      },
      {
        id: '2', 
        name: 'Demo Company 2',
        industry: 'healthtech',
        stage: 'series-a',
        description: 'AI-powered healthcare solution',
        target_raise: 2000000
      }
    ]
  } else {
    // Real Supabase mode
    user = await requireAuth('investor')
    const supabase = await createServerSupabaseClient()

    // Get investor's investments
    const { data: investmentsData } = await supabase
      .from('investments')
      .select(`
        *,
        companies (
          name,
          industry,
          stage,
          description
        )
      `)
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    investments = investmentsData

    // Get total investment amount
    const { data: investmentSums } = await supabase
      .from('investments')
      .select('amount')
      .eq('investor_id', user.id)
      .eq('status', 'committed')

    totalInvested = investmentSums?.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0

    // Get SPV memberships
    const { data: spvMembershipsData } = await supabase
      .from('spv_members')
      .select(`
        *,
        spvs (
          name,
          target_raise,
          committed_amount,
          companies (name)
        )
      `)
      .eq('investor_id', user.id)

    spvMemberships = spvMembershipsData

    // Get recent companies (for discovery)
    const { data: recentCompaniesData } = await supabase
      .from('companies')
      .select('*')
      .neq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(6)

    recentCompanies = recentCompaniesData
  }

  const activeInvestments = investments?.filter(inv => inv.status === 'committed').length || 0
  const totalSPVs = spvMemberships?.length || 0

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation user={user} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Demo Banner */}
          {isDemo && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect as an investor</p>
                <p>Explore startup discovery, investment tracking, and portfolio management features.</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.full_name}
            </h1>
            <p className="text-gray-600 mt-1">
              Discover your next investment opportunity
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalInvested.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Investments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeInvestments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">🤝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">SPV Memberships</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSPVs}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 text-xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Portfolio Companies</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {investments?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Investments */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Investments</h2>
                <Link 
                  href="/dashboard/investor/investments"
                  className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                  View all
                </Link>
              </div>
              <div className="p-6">
                {investments && investments.length > 0 ? (
                  <div className="space-y-4">
                    {investments.map((investment: any) => (
                      <div key={investment.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {investment.companies?.name || 'Unknown Company'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {investment.instrument} • {investment.companies?.stage}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${investment.amount?.toLocaleString()}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            investment.status === 'committed' ? 'bg-green-100 text-green-800' :
                            investment.status === 'in_discussion' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {investment.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No investments yet</p>
                    <Link
                      href="/dashboard/investor/browse"
                      className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
                    >
                      Browse startups to get started
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/dashboard/investor/browse"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">🔍</span>
                      <p className="text-sm font-medium text-gray-900">Browse Startups</p>
                      <p className="text-xs text-gray-500">Discover new deals</p>
                    </div>
                  </Link>

                  <Link 
                    href="/dashboard/investor/spvs"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">💰</span>
                      <p className="text-sm font-medium text-gray-900">Join SPVs</p>
                      <p className="text-xs text-gray-500">Pool investments</p>
                    </div>
                  </Link>

                  <Link 
                    href="/dashboard/investor/analytics"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">📈</span>
                      <p className="text-sm font-medium text-gray-900">Portfolio Analytics</p>
                      <p className="text-xs text-gray-500">Track performance</p>
                    </div>
                  </Link>

                  <Link 
                    href="/dashboard/investor/investments"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">💼</span>
                      <p className="text-sm font-medium text-gray-900">My Investments</p>
                      <p className="text-xs text-gray-500">Manage portfolio</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Companies */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recently Added Companies</h2>
              <Link 
                href="/dashboard/investor/browse"
                className="text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Browse all
              </Link>
            </div>
            <div className="p-6">
              {recentCompanies && recentCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentCompanies.map((company: any) => (
                    <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded capitalize">
                          {company.stage?.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 capitalize">{company.industry}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {company.description}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Target: ${company.target_raise?.toLocaleString() || 'TBD'}
                        </span>
                        <Link
                          href={`/dashboard/investor/companies/${company.id}`}
                          className="text-xs text-indigo-600 hover:text-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No companies available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}