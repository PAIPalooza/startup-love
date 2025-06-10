'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
        setMessage('Demo mode: Supabase not configured. Click "Demo Login" to continue.')
        setIsDemoMode(true)
        return
      }

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      
      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      if (error.message.includes('Missing Supabase environment variables')) {
        setMessage('Demo mode: Supabase not configured. Click "Demo Login" to continue.')
        setIsDemoMode(true)
      } else {
        setMessage('Error sending magic link')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Simulate role selection for demo
    router.push('/auth/role-select?demo=true')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">CapConnect</h1>
          <p className="text-gray-600 mt-2">The smartest way to match capital with innovation</p>
        </div>
        
        <form onSubmit={handleMagicLink} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        
        {message && (
          <div className={`text-center text-sm p-3 rounded-md ${
            message.includes('Error') ? 'text-red-600 bg-red-50' : 
            message.includes('Demo mode') ? 'text-blue-600 bg-blue-50' :
            'text-green-600 bg-green-50'
          }`}>
            {message}
          </div>
        )}

        {isDemoMode && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <button
                onClick={handleDemoLogin}
                className="w-full flex justify-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue with Demo Login
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Demo Mode Active</p>
                <p className="mb-2">To enable full functionality:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Create a Supabase project at supabase.com</li>
                  <li>Run the database schema from lib/database.sql</li>
                  <li>Update .env.local with your Supabase credentials</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500">
          New to CapConnect? You will choose your role after signing in.
        </div>
      </div>
    </div>
  )
}