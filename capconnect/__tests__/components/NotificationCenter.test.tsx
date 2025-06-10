import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationCenter } from '@/components/ui/notification-center'

// Mock the createClient function to return a mock with the expected methods
jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ 
              data: mockNotifications, 
              error: null 
            })),
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn(),
      })),
    })),
    removeChannel: jest.fn(),
  }),
}))

const mockNotifications = [
  {
    id: '1',
    message: 'New investor viewed your deck',
    type: 'view',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    message: 'Investment commitment received',
    type: 'commitment',
    is_read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
]

describe('NotificationCenter', () => {
  it('renders notification bell with unread count', async () => {
    render(<NotificationCenter userId="user1" />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // Unread count
    })
  })

  it('opens notification dropdown when bell is clicked', async () => {
    render(<NotificationCenter userId="user1" />)
    
    const bellButton = screen.getByRole('button')
    fireEvent.click(bellButton)
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('New investor viewed your deck')).toBeInTheDocument()
    })
  })

  it('displays notifications with correct formatting', async () => {
    render(<NotificationCenter userId="user1" />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('New investor viewed your deck')).toBeInTheDocument()
      expect(screen.getByText('Investment commitment received')).toBeInTheDocument()
      expect(screen.getByText('Just now')).toBeInTheDocument()
      expect(screen.getByText('1h ago')).toBeInTheDocument()
    })
  })

  it('marks notification as read when clicked', async () => {
    render(<NotificationCenter userId="user1" />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      const markReadButton = screen.getByText('Mark read')
      fireEvent.click(markReadButton)
    })
    
    // Should update the UI to reflect read status
    await waitFor(() => {
      expect(screen.queryByText('Mark read')).not.toBeInTheDocument()
    })
  })

  it('marks all notifications as read', async () => {
    render(<NotificationCenter userId="user1" />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      const markAllButton = screen.getByText('Mark all as read')
      fireEvent.click(markAllButton)
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Mark all as read')).not.toBeInTheDocument()
    })
  })

  it('deletes notification when delete is clicked', async () => {
    render(<NotificationCenter userId="user1" />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])
    })
    
    // Notification should be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('New investor viewed your deck')).not.toBeInTheDocument()
    })
  })

  it('shows empty state when no notifications', () => {
    // Mock empty notifications
    const { createClient } = require('@/lib/supabase')
    createClient.mockReturnValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => Promise.resolve({ 
                data: [], 
                error: null 
              })),
            })),
          })),
        })),
      })),
      channel: jest.fn(() => ({
        on: jest.fn(() => ({
          subscribe: jest.fn(),
        })),
      })),
      removeChannel: jest.fn(),
    })
    
    render(<NotificationCenter userId="user1" />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    render(<NotificationCenter userId="user1" />)
    
    fireEvent.click(screen.getByRole('button'))
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument()
    })
    
    // Click outside (backdrop)
    const backdrop = document.querySelector('.fixed.inset-0')
    if (backdrop) {
      fireEvent.click(backdrop)
    }
    
    await waitFor(() => {
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
    })
  })
})