'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateCompanyPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    stage: 'pre-seed',
    website: '',
    description: '',
    founded_date: '',
    country: 'US',
    target_raise: '',
  })
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          name: formData.name,
          industry: formData.industry,
          stage: formData.stage,
          website: formData.website || null,
          description: formData.description,
          founded_date: formData.founded_date || null,
          country: formData.country,
          target_raise: formData.target_raise ? parseFloat(formData.target_raise) : null,
        })

      if (error) throw error

      router.push('/dashboard/founder')
    } catch (error) {
      console.error('Error creating company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Create Your Company Profile</h1>
            <p className="text-gray-600 mt-2">
              Let's get your company set up on CapConnect
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry *
                </label>
                <select
                  name="industry"
                  id="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select industry</option>
                  <option value="fintech">Fintech</option>
                  <option value="healthtech">HealthTech</option>
                  <option value="edtech">EdTech</option>
                  <option value="saas">SaaS</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="climate">Climate Tech</option>
                  <option value="consumer">Consumer</option>
                  <option value="b2b">B2B</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                  Funding Stage *
                </label>
                <select
                  name="stage"
                  id="stage"
                  required
                  value={formData.stage}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pre-seed">Pre-seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="growth">Growth</option>
                </select>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label htmlFor="founded_date" className="block text-sm font-medium text-gray-700">
                  Founded Date
                </label>
                <input
                  type="date"
                  name="founded_date"
                  id="founded_date"
                  value={formData.founded_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="target_raise" className="block text-sm font-medium text-gray-700">
                  Target Raise ($)
                </label>
                <input
                  type="number"
                  name="target_raise"
                  id="target_raise"
                  value={formData.target_raise}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="500000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Company Description *
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what your company does, your mission, and key value propositions..."
              />
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
                {loading ? 'Creating...' : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}