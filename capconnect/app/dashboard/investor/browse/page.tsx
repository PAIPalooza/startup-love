import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { CompanyCard } from '@/components/ui/company-card'
import { CompanyFilters } from '@/components/ui/company-filters'

interface SearchParams {
  industry?: string
  stage?: string
  search?: string
}

export default async function BrowseStartupsPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const user = await requireAuth('investor')
  const supabase = createServerSupabaseClient()

  // Build query with filters
  let query = supabase
    .from('companies')
    .select(`
      *,
      users (full_name, is_verified),
      financial_metrics (mrr, arr, burn_rate, runway_months)
    `)
    .neq('user_id', user.id) // Don't show investor's own companies
    .order('created_at', { ascending: false })

  // Apply filters
  if (searchParams.industry && searchParams.industry !== 'all') {
    query = query.eq('industry', searchParams.industry)
  }
  
  if (searchParams.stage && searchParams.stage !== 'all') {
    query = query.eq('stage', searchParams.stage)
  }

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: companies } = await query

  // Get unique industries and stages for filters
  const { data: allCompanies } = await supabase
    .from('companies')
    .select('industry, stage')
    .neq('user_id', user.id)

  const industries = [...new Set(allCompanies?.map(c => c.industry).filter(Boolean))]
  const stages = [...new Set(allCompanies?.map(c => c.stage).filter(Boolean))]

  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation user={user} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Startups</h1>
            <p className="text-gray-600 mt-1">
              Discover your next investment opportunity
            </p>
          </div>

          {/* Filters */}
          <CompanyFilters 
            industries={industries}
            stages={stages}
            currentFilters={searchParams}
          />

          {/* Results */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {companies?.length || 0} companies found
              </p>
            </div>

            {companies && companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company: any) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters or check back later for new companies.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}