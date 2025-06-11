import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!existingUser) {
        // New user, redirect to role selection
        return NextResponse.redirect(`${origin}/auth/role-select`)
      } else {
        // Existing user, redirect to their dashboard
        const dashboardUrl = existingUser.role === 'founder' ? '/dashboard/founder' : '/dashboard/investor'
        return NextResponse.redirect(`${origin}${dashboardUrl}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}