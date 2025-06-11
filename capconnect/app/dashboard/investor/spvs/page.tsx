import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { SpvManagement } from '@/components/ui/spv-management'
import { redirect } from 'next/navigation'

interface Props {
    searchParams: { demo?: string }
}

export default async function InvestorSpvsPage({ searchParams }: Props) {
    const isDemo = searchParams.demo === 'true'
    
    let user, spvs
    
    if (isDemo) {
        // Demo mode with mock data
        user = createDemoUser('investor')
        spvs = [
            {
                id: '1',
                name: 'Cloud SaaS Ventures SPV',
                target_amount: 750000,
                raised_amount: 320000,
                status: 'open',
                company_name: 'CloudTech Solutions',
                expiry_date: '2025-08-15',
                min_investment: 15000,
                participants: 5,
                description: 'SPV for CloudTech Solutions, an emerging SaaS platform specializing in enterprise automation solutions with current MRR of $45K and 22% YoY growth.'
            },
            {
                id: '2',
                name: 'Green Energy Fund',
                target_amount: 1200000,
                raised_amount: 1200000,
                status: 'filled',
                company_name: 'EcoGen Power',
                expiry_date: '2025-07-20',
                min_investment: 50000,
                participants: 15,
                description: 'Successfully funded SPV for EcoGen Power\'s Series B round. The company has developed patented renewable energy storage solutions with contracts signed with two Fortune 500 companies.'
            },
            {
                id: '3',
                name: 'HealthTech Innovations SPV',
                target_amount: 500000,
                raised_amount: 425000,
                status: 'open',
                company_name: 'MediSync',
                expiry_date: '2025-09-30',
                min_investment: 25000,
                participants: 9,
                description: 'SPV for MediSync, a healthcare AI startup focused on predictive diagnostics. FDA approval expected in Q3 2025 with 3 major hospital partnerships already secured.'
            }
        ]
    } else {
        // Real Supabase mode
        user = await requireAuth('investor')
        const supabase = await createServerSupabaseClient()
        
        // Get all SPVs that are available for this investor
        // Exclude SPVs the investor is already part of
        const { data: investorSpvs } = await supabase
            .from('investor_spvs')
            .select('spv_id')
            .eq('investor_id', user.id)
        
        const investorSpvIds = investorSpvs?.map(is => is.spv_id) || []
        
        // Get all active SPVs that the investor can join
        const { data: spvsData } = await supabase
            .from('spvs')
            .select(`
                id,
                name,
                target_amount,
                raised_amount,
                status,
                expiry_date,
                min_investment,
                description,
                companies (
                    name
                ),
                spv_investors (
                    id
                )
            `)
            .not('id', 'in', `(${investorSpvIds.join(',')})`)
            .in('status', ['open', 'filled'])
            .order('created_at', { ascending: false })
        
        // Format data for the component
        spvs = spvsData?.map(spv => ({
            id: spv.id,
            name: spv.name,
            target_amount: spv.target_amount,
            raised_amount: spv.raised_amount,
            status: spv.status,
            company_name: spv.companies?.name,
            expiry_date: spv.expiry_date,
            min_investment: spv.min_investment,
            participants: spv.spv_investors?.length || 0,
            description: spv.description
        })) || []
    }
    
    // Handle client-side actions via server actions
    async function joinSpv(spvId: string) {
        'use server'
        
        if (isDemo) {
            // In demo mode, just redirect to details page
            return redirect(`/dashboard/investor/spvs/${spvId}?demo=true`)
        }
        
        const currentUser = await requireAuth('investor')
        const supabase = await createServerSupabaseClient()
        
        // Get SPV details to check if it's still open
        const { data: spv } = await supabase
            .from('spvs')
            .select('status, min_investment')
            .eq('id', spvId)
            .single()
            
        if (spv?.status !== 'open') {
            // SPV no longer available
            return redirect(`/dashboard/investor/spvs?error=spv_unavailable`)
        }
        
        // Redirect to the SPV details page where they can confirm their investment
        return redirect(`/dashboard/investor/spvs/${spvId}`)
    }
    
    async function viewDetails(spvId: string) {
        'use server'
        
        if (isDemo) {
            return redirect(`/dashboard/investor/spvs/${spvId}?demo=true`)
        }
        
        return redirect(`/dashboard/investor/spvs/${spvId}`)
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
                                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect SPV Management</p>
                                <p>Browse and explore investment opportunities in Special Purpose Vehicles.</p>
                            </div>
                        </div>
                    )}
                    
                    {/* SPV Info Section */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg shadow-lg p-8 text-white">
                        <h1 className="text-3xl font-semibold mb-2">Special Purpose Vehicle Investments</h1>
                        <p className="text-lg opacity-90">Pool resources with other investors to access exclusive deals</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm font-medium text-white/70">Minimum Investment</p>
                                <p className="text-xl font-semibold">$15,000+</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm font-medium text-white/70">Average Returns</p>
                                <p className="text-xl font-semibold">2.8x</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm font-medium text-white/70">Deal Flow</p>
                                <p className="text-xl font-semibold">Monthly</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-sm font-medium text-white/70">Management Fee</p>
                                <p className="text-xl font-semibold">2%</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* SPV Management Component */}
                    <SpvManagement 
                        spvs={spvs} 
                        onJoinSpv={joinSpv} 
                        onViewDetails={viewDetails} 
                    />
                </div>
            </main>
        </div>
    )
}
