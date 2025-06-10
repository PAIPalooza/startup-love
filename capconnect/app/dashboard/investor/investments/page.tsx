import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import Link from 'next/link'

interface Props {
    searchParams: { demo?: string }
}

export default async function InvestorInvestmentsPage({ searchParams }: Props) {
    const isDemo = searchParams.demo === 'true'
    
    let user, investments
    
    if (isDemo) {
        // Demo mode with mock data
        user = createDemoUser('investor')
        investments = [
            {
                id: '1',
                company: {
                    id: '101',
                    name: 'CloudTech Solutions',
                    logo: '/logos/cloudtech.png',
                    industry: 'SaaS',
                    stage: 'Series A',
                    location: 'San Francisco, CA'
                },
                amount: 250000,
                percentage: 2.5,
                date: '2025-01-15',
                instrument: 'SAFE',
                status: 'active',
                valuation: 10000000,
                current_valuation: 15000000,
                performance: 50,
                documents: 5
            },
            {
                id: '2',
                company: {
                    id: '102',
                    name: 'EcoGen Power',
                    logo: '/logos/ecogen.png',
                    industry: 'CleanTech',
                    stage: 'Series B',
                    location: 'Portland, OR'
                },
                amount: 500000,
                percentage: 1.8,
                date: '2024-11-10',
                instrument: 'Equity',
                status: 'active',
                valuation: 28000000,
                current_valuation: 35000000,
                performance: 25,
                documents: 8
            },
            {
                id: '3',
                company: {
                    id: '103',
                    name: 'MediSync',
                    logo: '/logos/medisync.png',
                    industry: 'HealthTech',
                    stage: 'Seed',
                    location: 'Boston, MA'
                },
                amount: 100000,
                percentage: 4.2,
                date: '2025-03-22',
                instrument: 'Convertible Note',
                status: 'active',
                valuation: 2400000,
                current_valuation: 3200000,
                performance: 33,
                documents: 4
            },
            {
                id: '4',
                company: {
                    id: '104',
                    name: 'DataViz AI',
                    logo: '/logos/dataviz.png',
                    industry: 'AI/ML',
                    stage: 'Pre-seed',
                    location: 'Austin, TX'
                },
                amount: 50000,
                percentage: 5.0,
                date: '2025-04-05',
                instrument: 'SAFE',
                status: 'active',
                valuation: 1000000,
                current_valuation: 1250000,
                performance: 25,
                documents: 3
            }
        ]
    } else {
        // Real Supabase mode
        user = await requireAuth('investor')
        const supabase = await createServerSupabaseClient()
        
        // Get all investments by this investor
        const { data: investmentsData } = await supabase
            .from('investments')
            .select(`
                id,
                amount,
                percentage,
                date,
                instrument,
                status,
                initial_valuation,
                companies (
                    id,
                    name,
                    logo_url,
                    industry,
                    stage,
                    location,
                    current_valuation
                ),
                documents (
                    id
                )
            `)
            .eq('investor_id', user.id)
            .order('date', { ascending: false })
        
        // Format data for the component
        investments = investmentsData?.map(inv => ({
            id: inv.id,
            company: {
                id: inv.companies.id,
                name: inv.companies.name,
                logo: inv.companies.logo_url,
                industry: inv.companies.industry,
                stage: inv.companies.stage,
                location: inv.companies.location
            },
            amount: inv.amount,
            percentage: inv.percentage,
            date: inv.date,
            instrument: inv.instrument,
            status: inv.status,
            valuation: inv.initial_valuation,
            current_valuation: inv.companies.current_valuation,
            performance: inv.initial_valuation && inv.companies.current_valuation 
                ? Math.round(((inv.companies.current_valuation - inv.initial_valuation) / inv.initial_valuation) * 100) 
                : 0,
            documents: inv.documents?.length || 0
        })) || []
    }
    
    // Calculate portfolio stats
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => {
        const currentEquityValue = inv.current_valuation * (inv.percentage / 100);
        return sum + currentEquityValue;
    }, 0);
    const overallPerformance = totalInvested > 0 
        ? Math.round(((totalCurrentValue - totalInvested) / totalInvested) * 100) 
        : 0;
    
    return (
        <div className="flex h-screen bg-gray-100">
            <Navigation user={user} />
            
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Demo Banner */}
                    {isDemo && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect Investment Portfolio</p>
                                <p>Viewing your investment portfolio and performance metrics.</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Portfolio Summary */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">My Investment Portfolio</h1>
                                <p className="text-gray-500 mt-1">{investments.length} investments across {new Set(investments.map(inv => inv.company.industry)).size} industries</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-3">
                                <Link
                                    href="/dashboard/investor/browse"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                                >
                                    Add New Investment
                                </Link>
                                <button
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md"
                                >
                                    Export Portfolio
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-500">Total Invested</p>
                                <p className="text-2xl font-semibold text-gray-900">${totalInvested.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-500">Current Value</p>
                                <p className="text-2xl font-semibold text-gray-900">${totalCurrentValue.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-500">Overall Performance</p>
                                <p className={`text-2xl font-semibold ${overallPerformance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {overallPerformance >= 0 ? '+' : ''}{overallPerformance}%
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Investments List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Investment Details</h2>
                        </div>
                        
                        {investments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Investment
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Equity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Performance
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Documents
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {investments.map((investment) => (
                                            <tr key={investment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                            {investment.company.logo ? (
                                                                <img 
                                                                    className="h-10 w-10 rounded-full" 
                                                                    src={investment.company.logo} 
                                                                    alt={investment.company.name} 
                                                                />
                                                            ) : (
                                                                <span className="text-gray-500 font-medium">
                                                                    {investment.company.name.charAt(0)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {investment.company.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {investment.company.industry} • {investment.company.stage}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ${investment.amount.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {investment.instrument} • {new Date(investment.date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {investment.percentage}%
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ${Math.round(investment.current_valuation * (investment.percentage / 100)).toLocaleString()} current value
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        investment.performance > 0 ? 'bg-green-100 text-green-800' : 
                                                        investment.performance < 0 ? 'bg-red-100 text-red-800' : 
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {investment.performance > 0 ? '+' : ''}{investment.performance}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {investment.documents} docs
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/dashboard/investor/companies/${investment.company.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg 
                                    className="mx-auto h-12 w-12 text-gray-400" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No investments yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by exploring potential investment opportunities
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/dashboard/investor/browse"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Browse Startups
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
