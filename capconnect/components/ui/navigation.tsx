'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/lib/auth'
import { LogOut, Settings, User as UserIcon } from 'lucide-react'
import { NotificationCenter } from './notification-center'

interface NavigationProps {
  user: User
}

export function Navigation({ user }: NavigationProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (error) {
      // Demo mode or Supabase not configured
      console.log('Demo mode sign out')
    }
    window.location.href = '/auth/login'
  }

  const founderNavItems = [
    { name: 'Dashboard', href: '/dashboard/founder', icon: '📊' },
    { name: 'Company', href: '/dashboard/founder/company', icon: '🏢' },
    { name: 'Cap Table', href: '/dashboard/founder/cap-table', icon: '📈' },
    { name: 'SPVs', href: '/dashboard/founder/spvs', icon: '💰' },
    { name: 'Documents', href: '/dashboard/founder/documents', icon: '📁' },
    { name: 'Deal Room', href: '/dashboard/founder/deal-room', icon: '💬' },
    { name: 'Analytics', href: '/dashboard/founder/analytics', icon: '📊' },
  ]

  const investorNavItems = [
    { name: 'Dashboard', href: '/dashboard/investor', icon: '📊' },
    { name: 'Browse Startups', href: '/dashboard/investor/browse', icon: '🔍' },
    { name: 'My Investments', href: '/dashboard/investor/investments', icon: '💼' },
    { name: 'SPVs', href: '/dashboard/investor/spvs', icon: '💰' },
    { name: 'Analytics', href: '/dashboard/investor/analytics', icon: '📈' },
  ]

  const navItems = user.role === 'founder' ? founderNavItems : investorNavItems

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">CapConnect</h1>
          <div className="mt-2 flex items-center space-x-2">
            <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.full_name?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                  pathname === item.href
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <NotificationCenter userId={user.id} />
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
              <Settings className="h-5 w-5" />
            </button>
            <button 
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}