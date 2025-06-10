'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Company {
  id: string
  name: string
  industry: string
  stage: string
  description: string
  target_raise: number
  current_raised: number
  website?: string
  users?: {
    full_name: string
    is_verified: boolean
  }
  financial_metrics?: Array<{
    mrr: number
    arr: number
    burn_rate: number
    runway_months: number
  }>
}

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const [showInvestModal, setShowInvestModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [instrument, setInstrument] = useState('SAFE')
  const supabase = createClient()

  const latestMetrics = company.financial_metrics?.[0]
  const fundingProgress = company.target_raise 
    ? (company.current_raised / company.target_raise) * 100 
    : 0

  const handleInvestment = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('investments')
        .insert({
          investor_id: user.id,
          company_id: company.id,
          amount: parseFloat(amount),
          instrument,
          status: 'committed'
        })

      if (error) throw error

      // Create notification for founder
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: company.users?.id, // This would need to be fetched properly
          message: `New investment commitment of $${amount} from an investor`,
          type: 'commitment',
          related_id: company.id
        })

      setShowInvestModal(false)
      setAmount('')
      alert('Investment commitment submitted successfully!')
    } catch (error) {
      console.error('Error submitting investment:', error)
      alert('Error submitting investment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
              {company.users?.is_verified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
            </div>
            <p className="text-sm text-gray-600 capitalize">
              {company.industry} • {company.stage?.replace('-', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ${company.target_raise?.toLocaleString() || 'TBD'}
            </p>
            <p className="text-xs text-gray-500">Target raise</p>
          </div>
        </div>

        {/* Progress bar */}
        {company.target_raise && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>${company.current_raised?.toLocaleString() || '0'} raised</span>
              <span>{fundingProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {company.description}
        </p>

        {/* Metrics */}
        {latestMetrics && (
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div>
              <p className="text-gray-500">MRR</p>
              <p className="font-medium">${latestMetrics.mrr?.toLocaleString() || '0'}</p>
            </div>
            <div>
              <p className="text-gray-500">Runway</p>
              <p className="font-medium">{latestMetrics.runway_months || '0'} months</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/investor/companies/${company.id}`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => setShowInvestModal(true)}
            className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Invest
          </button>
        </div>

        {/* Founder */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Founded by {company.users?.full_name || 'Founder'}
          </p>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Invest in {company.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instrument
                </label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="SAFE">SAFE</option>
                  <option value="Equity">Equity</option>
                  <option value="Convertible Note">Convertible Note</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInvestment}
                disabled={loading || !amount}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}