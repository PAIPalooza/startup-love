import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard'

interface Props {
    searchParams: { demo?: string }
}

export default async function FounderAnalyticsPage({ searchParams }: Props) {
    const isDemo = searchParams.demo === 'true'
    
    let user, metrics
    
    if (isDemo) {
        // Demo mode with mock data
        user = createDemoUser('founder')
        metrics = {
            investorViews: [
                { date: '2025-05-05', count: 12 },
                { date: '2025-05-06', count: 18 },
                { date: '2025-05-07', count: 15 },
                { date: '2025-05-08', count: 22 },
                { date: '2025-05-09', count: 30 },
                { date: '2025-05-10', count: 25 },
                { date: '2025-05-11', count: 28 },
            ],
            documentViews: [
                { date: '2025-05-05', count: 8 },
                { date: '2025-05-06', count: 12 },
                { date: '2025-05-07', count: 9 },
                { date: '2025-05-08', count: 15 },
                { date: '2025-05-09', count: 18 },
                { date: '2025-05-10', count: 14 },
                { date: '2025-05-11', count: 16 },
            ],
            investorEngagement: [
                { name: 'John Doe', score: 92, actions: 27 },
                { name: 'Jane Smith', score: 85, actions: 19 },
                { name: 'Robert Johnson', score: 78, actions: 14 },
                { name: 'Emily Wilson', score: 65, actions: 8 },
                { name: 'Michael Brown', score: 89, actions: 22 },
            ],
        }
    } else {
        // Real Supabase mode
        user = await requireAuth('founder')
        const supabase = await createServerSupabaseClient()
        
        // Fetch company ID for the current founder
        const { data: companyData } = await supabase
            .from('companies')
            .select('id')
            .eq('founder_id', user.id)
            .single()
            
        const companyId = companyData?.id
        
        // Get analytics data from various tables
        if (companyId) {
            // Get investor profile views
            const { data: viewsData } = await supabase
                .from('analytics_views')
                .select('date, count')
                .eq('company_id', companyId)
                .order('date', { ascending: true })
                .limit(30)
                
            // Get document views
            const { data: docViewsData } = await supabase
                .from('analytics_document_views')
                .select('date, count')
                .eq('company_id', companyId)
                .order('date', { ascending: true })
                .limit(30)
                
            // Get investor engagement scores
            const { data: engagementData } = await supabase
                .from('investor_engagement')
                .select('users (full_name), score, action_count')
                .eq('company_id', companyId)
                .order('score', { ascending: false })
                .limit(10)
                
            metrics = {
                investorViews: viewsData || [],
                documentViews: docViewsData || [],
                investorEngagement: engagementData ? engagementData.map((item) => ({
                    name: item.users.full_name,
                    score: item.score,
                    actions: item.action_count
                })) : []
            }
        } else {
            // No company found for this founder
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
                                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect Analytics</p>
                                <p>Viewing sample analytics data and engagement metrics for demonstration purposes.</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-6">
                        {/* Key Metrics Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Profile Views</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.investorViews.reduce((sum, item) => sum + item.count, 0)}
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 22% from last month
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Document Views</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.documentViews.reduce((sum, item) => sum + item.count, 0)}
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 15% from last month
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. Relationship Score</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.investorEngagement.length > 0 
                                        ? Math.round(metrics.investorEngagement.reduce((sum, item) => sum + item.score, 0) / metrics.investorEngagement.length)
                                        : 0}%
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 8% from last month
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Investors</p>
                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                    {metrics.investorEngagement.length}
                                </p>
                                <p className="text-green-600 text-sm">
                                    ↑ 3 from last month
                                </p>
                            </div>
                        </div>
                        
                        {/* Main Analytics Dashboard */}
                        <AnalyticsDashboard metrics={metrics} />
                    </div>
                </div>
            </main>
        </div>
    )
}
