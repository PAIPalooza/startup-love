'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface CompanyFiltersProps {
  industries: string[]
  stages: string[]
  currentFilters: {
    industry?: string
    stage?: string
    search?: string
  }
}

export function CompanyFilters({ industries, stages, currentFilters }: CompanyFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilters.search || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value === 'all' || !value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/dashboard/investor/browse')
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="flex">
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Industry Filter */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <select
            id="industry"
            value={currentFilters.industry || 'all'}
            onChange={(e) => updateFilter('industry', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry} className="capitalize">
                {industry.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Filter */}
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            id="stage"
            value={currentFilters.stage || 'all'}
            onChange={(e) => updateFilter('stage', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage} className="capitalize">
                {stage.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(currentFilters.industry || currentFilters.stage || currentFilters.search) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {currentFilters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Search: {currentFilters.search}
                </span>
              )}
              
              {currentFilters.industry && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                  {currentFilters.industry.replace('-', ' ')}
                </span>
              )}
              
              {currentFilters.stage && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                  {currentFilters.stage.replace('-', ' ')}
                </span>
              )}
            </div>
            
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}