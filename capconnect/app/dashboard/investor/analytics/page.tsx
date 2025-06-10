import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard'

interface Props {
    searchParams: { demo?: string }
}

export default async function InvestorAnalyticsPage({ searchParams }: Props) {
    const isDemo = searchParams.demo === 'true'
    
    let user, metrics
    
    if (isDemo) {
        // Demo mode with mock data
        user = createDemoUser('investor')
        metrics = {
            investorViews: [
                { date: '2025-05-05', count: 3 },
                { date: '2025-05-06', count: 5 },
                { date: '2025-05-07', count: 4 },
                { date: '2025-05-08', count: 8 },
                { date: '2025-05-09', count: 7 },
                { date: '2025-05-10', count: 6 },
                { date: '2025-05-11', count: 9 },
            ],
            documentViews: [
                { date: '2025-05-05', count: 2 },
                { date: '2025-05-06', count: 4 },
                { date: '2025-05-07', count: 3 },
                { date: '2025-05-08', count: 6 },
                { date: '2025-05-09', count: 5 },
                { date: '2025-05-10', count: 4 },
                { date: '2025-05-11', count: 7 },
            ],
            investorEngagement: [
                { name: 'CloudTech Solutions', score: 92, actions: 27 },
                { name: 'EcoGen Power', score: 85, actions: 19 },
                { name: 'MediSync', score: 78, actions: 14 },
                { name: 'DataViz AI', score: 65, actions: 8 },
                { name: 'AgriTech Innovations', score: 89, actions: 22 },
            ],
        }
    } else {
        // Real Supabase mode
        user = await requireAuth('investor')
        const supabase = await createServerSupabaseClient()
        
        // Get all investments by this investor
        const { data: investmentsData } = await supabase
            .from('investments')
            .select('company_id')
            .eq('investor_id', user.id)
            
        const companyIds = investmentsData?.map(inv => inv.company_id) || []
        
        // Get analytics data from various tables
        if (companyIds.length > 0) {
            // Get profile view analytics
            const { data: viewsData } = await supabase
                .from('investor_analytics_views')
                .select('date, count')
                .eq('investor_id', user.id)
                .order('date', { ascending: true })
                .limit(30)
                
            // Get document views
            const { data: docViewsData } = await supabase
                .from('investor_document_views')
                .select('date, count')
                .eq('investor_id', user.id)
                .order('date', { ascending: true })
                .limit(30)
                
            // Get company engagement scores (for companies the investor has invested in)
            const { data: engagementData } = await supabase
                .from('companies')
                .select('name, engagement_score, interaction_count')
                .in('id', companyIds)
                .order('engagement_score', { ascending: false })
                .limit(10)
                
            metrics = {
                investorViews: viewsData || [],
                documentViews: docViewsData || [],
                investorEngagement: engagementData ? engagementData.map((item) => ({
                    name: item.name,
                    score: item.engagement_score,
                    actions: item.interaction_count
                })) : []
            }
        } else {
            // No investments found for this investor
            metrics = {
                investorViews: [],
                documentViews: [],
                investorEngagement: []
            }
        }
    }
    
    return (
        <div className="flex h-screen bg-gray-100">
            <Navigation user={user} />
            
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Demo Banner */}
                    {isDemo && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect Investor Analytics</p>
                                <p>Viewing sample portfolio analytics and engagement metrics for demonstration purposes.</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-6">
                        {/* Key Metrics Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Portfolio Companies</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.investorEngagement.length}
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 2 from last month
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Document Reviews</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.documentViews.reduce((sum, item) => sum + item.count, 0)}
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 12% from last month
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Portfolio Score</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.investorEngagement.length > 0 
                                        ? Math.round(metrics.investorEngagement.reduce((sum, item) => sum + item.score, 0) / metrics.investorEngagement.length)
                                        : 0}%
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 5% from last quarter
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Interactions</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.investorEngagement.reduce((sum, item) => sum + item.actions, 0)}
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 18% from last month
                                </p>
                            </div>
                        </div>
                        
                        {/* Analytics Dashboard - Note we reuse the component but in investor context */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Portfolio Analytics</h2>
                                <div>
                                    <select 
                                        className="p-2 border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        defaultValue="all"
                                    >
                                        <option value="all">All Portfolio</option>
                                        <option value="spv">SPV Investments</option>
                                        <option value="direct">Direct Investments</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Visualization Section */}
                            <div className="space-y-8">
                                {/* Returns by Investment Stage */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4 text-gray-800">Returns by Investment Stage</h3>
                                    <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">Investment stage return chart will appear here</p>
                                    </div>
                                </div>
                                
                                {/* Portfolio Allocation */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4 text-gray-800">Portfolio Allocation</h3>
                                    <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500 text-sm">Portfolio allocation chart will appear here</p>
                                    </div>
                                </div>
                                
                                {/* Company Health Score */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4 text-gray-800">Portfolio Company Health</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Company
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Health Score
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        MRR Growth
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Latest Update
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {metrics.investorEngagement.map((company, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {company.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`h-2 rounded-full w-12 ${
                                                                    company.score >= 80 ? 'bg-green-500' :
                                                                    company.score >= 60 ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                                }`}></div>
                                                                <span className="ml-2 text-sm text-gray-700">
                                                                    {company.score}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            +{Math.round(Math.random() * 25)}%
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date().toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
