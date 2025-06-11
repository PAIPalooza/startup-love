'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateSPVPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    target_raise: '',
    minimum_investment: '1000',
    description: ''
  })
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Get user's company
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!company) throw new Error('Company not found')

      const { error } = await supabase
        .from('spvs')
        .insert({
          name: formData.name,
          company_id: company.id,
          creator_id: user.id,
          target_raise: parseFloat(formData.target_raise),
          minimum_investment: parseFloat(formData.minimum_investment),
          status: 'active'
        })

      if (error) throw error

      router.push('/dashboard/founder/spvs')
    } catch (error) {
      console.error('Error creating SPV:', error)
      alert('Error creating SPV. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New SPV</h1>
            <p className="text-gray-600 mt-2">
              Set up a Special Purpose Vehicle to pool investor funds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                SPV Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Series A SPV, Angel Investor Pool"
              />
              <p className="mt-1 text-xs text-gray-500">
                Choose a descriptive name that investors will recognize
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="target_raise" className="block text-sm font-medium text-gray-700">
                  Target Raise ($) *
                </label>
                <input
                  type="number"
                  name="target_raise"
                  id="target_raise"
                  required
                  value={formData.target_raise}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="500000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Total amount you want to raise through this SPV
                </p>
              </div>

              <div>
                <label htmlFor="minimum_investment" className="block text-sm font-medium text-gray-700">
                  Minimum Investment ($) *
                </label>
                <input
                  type="number"
                  name="minimum_investment"
                  id="minimum_investment"
                  required
                  value={formData.minimum_investment}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum amount each investor must commit
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                SPV Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the purpose of this SPV, investment terms, and any special conditions..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional description to help investors understand this SPV
              </p>
            </div>

            {/* SPV Benefits Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">SPV Benefits:</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Simplifies your cap table by consolidating multiple investors</li>
                <li>• Allows faster closing with lead investor participation</li>
                <li>• Reduces legal complexity and administrative overhead</li>
                <li>• Enables smaller investors to participate in larger rounds</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create SPV'}
              </button>
            </div>
          </form>

          {/* Next Steps Info */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Next Steps:</h3>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Create your SPV and configure investment terms</li>
              <li>Invite investors to join the SPV through invitation links</li>
              <li>Track commitments and manage investor communications</li>
              <li>Close the SPV when target is reached or deadline passes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}