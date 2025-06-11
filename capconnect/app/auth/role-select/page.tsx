'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserRole } from '@/lib/auth'

export default function RoleSelectPage() {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('founder')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isStealthMode, setIsStealthMode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const handleRoleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (isDemo) {
        // Demo mode - simulate successful setup
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
        const dashboardUrl = selectedRole === 'founder' ? '/dashboard/founder?demo=true' : '/dashboard/investor?demo=true'
        router.push(dashboardUrl)
        return
      }

      // Real Supabase mode
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Create user profile
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: selectedRole,
          full_name: fullName,
          bio: bio || null,
          linkedin_url: linkedinUrl || null,
          is_stealth: selectedRole === 'investor' ? isStealthMode : false,
        })

      if (error) throw error

      // Redirect to appropriate dashboard
      const dashboardUrl = selectedRole === 'founder' ? '/dashboard/founder' : '/dashboard/investor'
      router.push(dashboardUrl)
    } catch (error) {
      console.error('Error setting up profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {isDemo && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium">🚀 Demo Mode Active</p>
              <p>You're experiencing CapConnect in demo mode. All data is simulated.</p>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CapConnect</h1>
          <p className="text-gray-600 mt-2">Let us set up your profile</p>
        </div>
        
        <form onSubmit={handleRoleSetup} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What describes you best?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'founder'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole('founder')}
              >
                <h3 className="font-semibold text-gray-900">🚀 Founder</h3>
                <p className="text-sm text-gray-600 mt-1">
                  I'm raising capital for my startup
                </p>
              </div>
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'investor'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole('investor')}
              >
                <h3 className="font-semibold text-gray-900">💼 Investor</h3>
                <p className="text-sm text-gray-600 mt-1">
                  I'm looking to invest in startups
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn URL (optional)
            </label>
            <input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Investor-specific options */}
          {selectedRole === 'investor' && (
            <div className="flex items-center">
              <input
                id="stealth"
                type="checkbox"
                checked={isStealthMode}
                onChange={(e) => setIsStealthMode(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="stealth" className="ml-2 block text-sm text-gray-900">
                Enable stealth mode (hide your profile from founders)
              </label>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  )
}