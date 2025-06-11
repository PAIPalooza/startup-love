import { requireAuth, createDemoUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Navigation } from '@/components/ui/navigation'
import { DealRoom } from '@/components/ui/deal-room'

interface Props {
    searchParams: { demo?: string }
}

export default async function FounderDealRoomPage({ searchParams }: Props) {
    const isDemo = searchParams.demo === 'true'
    
    let user, messages
    
    if (isDemo) {
        // Demo mode with mock data
        user = createDemoUser('founder')
        messages = [
            {
                id: '1',
                sender_name: 'John Investor',
                sender_role: 'investor',
                content: 'I reviewed your pitch deck. Very impressed with your traction!',
                created_at: '2025-06-10T14:30:00.000Z',
                read: true
            },
            {
                id: '2',
                sender_name: 'Jane Smith',
                sender_role: 'founder',
                content: 'Thank you! We're growing 20% month over month. Happy to share more metrics.',
                created_at: '2025-06-10T14:35:00.000Z',
                read: true
            },
            {
                id: '3',
                sender_name: 'John Investor',
                sender_role: 'investor',
                content: 'Great! Could you clarify your customer acquisition costs?',
                created_at: '2025-06-10T14:40:00.000Z',
                read: false
            },
        ]
    } else {
        // Real Supabase mode
        user = await requireAuth('founder')
        const supabase = await createServerSupabaseClient()
        
        // Get messages for this founder's deal room
        const { data: messagesData } = await supabase
            .from('messages')
            .select(`
                id,
                content,
                created_at,
                read,
                sender_id,
                sender_role,
                users!sender_id (full_name)
            `)
            .eq('founder_id', user.id)
            .order('created_at', { ascending: true })
        
        // Format messages for the component
        messages = messagesData?.map(msg => ({
            id: msg.id,
            sender_name: msg.users.full_name,
            sender_role: msg.sender_role,
            content: msg.content,
            created_at: msg.created_at,
            read: msg.read,
        })) || []
    }
    
    // Handle client-side actions via server actions
    async function sendMessage(content: string) {
        'use server'
        
        if (isDemo) return
        
        const supabase = await createServerSupabaseClient()
        const currentUser = await requireAuth('founder')
        
        await supabase.from('messages').insert({
            content,
            founder_id: currentUser.id,
            sender_id: currentUser.id,
            sender_role: 'founder',
            read: true, // Founder's own message is already read
        })
    }
    
    async function markAsRead(messageIds: string[]) {
        'use server'
        
        if (isDemo) return
        
        const supabase = await createServerSupabaseClient()
        
        await supabase
            .from('messages')
            .update({ read: true })
            .in('id', messageIds)
    }
    
    const currentUserObj = {
        id: user.id,
        role: 'founder',
        name: user.full_name || user.email
    }
    
    return (
        <div className="flex h-screen bg-gray-100">
            <Navigation user={user} />
            
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto h-[calc(100vh-theme(spacing.16))]">
                    {/* Demo Banner */}
                    {isDemo && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">🚀 Demo Mode - Experiencing CapConnect Deal Room</p>
                                <p>Testing real-time messaging functionality with sample conversations.</p>
                            </div>
                        </div>
                    )}
                    
                    <DealRoom 
                        messages={messages} 
                        onSendMessage={sendMessage} 
                        onMarkAsRead={markAsRead}
                        currentUser={currentUserObj}
                    />
                </div>
            </main>
        </div>
    )
}
