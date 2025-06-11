import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface Props {
  searchParams: { demo?: string }
}

export default async function FounderDashboard({ searchParams }: Props) {
  const isDemo = searchParams.demo === 'true'
  
  let user, company, metrics, investments, documentCount
  
  if (isDemo) {
    // Demo mode with mock data
    user = createDemoUser('founder')
    company = {
      id: 'demo-company-id',
      name: 'Demo Startup Inc.',
      industry: 'fintech',
      stage: 'seed',
      description: 'A revolutionary fintech startup',
      target_raise: 500000,
      current_raised: 150000,
      user_id: user.id,
    }
    metrics = {
      mrr: 15000,
      burn_rate: 25000,
      runway_months: 12,
      cac: 150,
    }
    investments = [
      {
        id: '1',
        amount: 50000,
        instrument: 'SAFE',
        status: 'committed',
        users: { full_name: 'Demo Investor 1' }
      },
      {
        id: '2', 
        amount: 100000,
        instrument: 'Convertible Note',
        status: 'in_discussion',
        users: { full_name: 'Demo Investor 2' }
      }
    ]
    documentCount = 5
  } else {
    // Real Supabase mode
    user = await requireAuth('founder')
    const supabase = await createServerSupabaseClient()

    // Get user's company
    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single()

    company = companyData

    if (!company) {
      redirect('/dashboard/founder/company/create')
    }

    // Get recent metrics
    const { data: metricsData } = await supabase
      .from('financial_metrics')
      .select('*')
      .eq('company_id', company.id)
      .order('month', { ascending: false })
      .limit(1)
      .single()

    metrics = metricsData

    // Get recent investments
    const { data: investmentsData } = await supabase
      .from('investments')
      .select('*, users(full_name)')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .limit(5)

    investments = investmentsData

    // Get document count
    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('company_id', company.id)

    documentCount = count
  }

  const latestMetrics = metrics || {}

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation user={user} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Demo Banner */}
          {isDemo && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-sm text-blue-800">
                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect with sample data</p>
                <p>To access real functionality, set up Supabase and restart without demo mode.</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.full_name}
            </h1>
            <p className="text-gray-600 mt-1">
              Here is what is happening with {company.name}
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
                  <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${latestMetrics.mrr?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-xl">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Burn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${latestMetrics.burn_rate?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-purple-600 text-xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Runway</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latestMetrics.runway_months || '0'} months
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
                  <p className="text-sm font-medium text-gray-600">CAC</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${latestMetrics.cac?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Investor Activity</h2>
              </div>
              <div className="p-6">
                {investments && investments.length > 0 ? (
                  <div className="space-y-4">
                    {investments.map((investment: any) => (
                      <div key={investment.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {investment.users?.full_name || 'Anonymous Investor'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {investment.instrument} • ${investment.amount?.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          investment.status === 'committed' ? 'bg-green-100 text-green-800' :
                          investment.status === 'in_discussion' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {investment.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No investor activity yet. Share your company profile to get started!
                  </p>
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
                    href="/dashboard/founder/documents"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">📁</span>
                      <p className="text-sm font-medium text-gray-900">Upload Documents</p>
                      <p className="text-xs text-gray-500">{documentCount || 0} documents</p>
                    </div>
                  </Link>

                  <Link 
                    href="/dashboard/founder/spvs"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">💰</span>
                      <p className="text-sm font-medium text-gray-900">Create SPV</p>
                      <p className="text-xs text-gray-500">Pool investors</p>
                    </div>
                  </Link>

                  <Link 
                    href="/dashboard/founder/cap-table"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">📊</span>
                      <p className="text-sm font-medium text-gray-900">Update Cap Table</p>
                      <p className="text-xs text-gray-500">Manage equity</p>
                    </div>
                  </Link>

                  <Link 
                    href="/dashboard/founder/analytics"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">📈</span>
                      <p className="text-sm font-medium text-gray-900">View Analytics</p>
                      <p className="text-xs text-gray-500">Track performance</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Company Status */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Company Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fundraising Status</p>
                  <p className="text-lg text-gray-900 capitalize">{company.stage || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Target Raise</p>
                  <p className="text-lg text-gray-900">
                    ${company.target_raise?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Raised</p>
                  <p className="text-lg text-gray-900">
                    ${company.current_raised?.toLocaleString() || '0'}
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