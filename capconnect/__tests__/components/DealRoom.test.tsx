import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DealRoom } from '@/components/ui/deal-room';

// Mock data for testing
const mockMessages = [
    {
        id: '1',
        sender_name: 'John Doe',
        sender_role: 'investor',
        content: 'Hello, I have some questions about your financial projections.',
        created_at: '2025-06-10T10:00:00.000Z',
        read: true
    },
    {
        id: '2',
        sender_name: 'Jane Smith',
        sender_role: 'founder',
        content: 'Let me clarify our growth strategy for you.',
        created_at: '2025-06-10T10:05:00.000Z',
        read: false
    }
];

// Mock functions
const mockSendMessage = jest.fn();
const mockMarkAsRead = jest.fn();

describe('DealRoom Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the deal room component', () => {
        render(
            <DealRoom 
                messages={mockMessages} 
                onSendMessage={mockSendMessage} 
                onMarkAsRead={mockMarkAsRead} 
                currentUser={{id: '123', role: 'founder', name: 'Jane Smith'}}
            />
        );
        
        expect(screen.getByText('Deal Room')).toBeInTheDocument();
        expect(screen.getByText('Hello, I have some questions about your financial projections.')).toBeInTheDocument();
    });

    it('should allow sending new messages', async () => {
        render(
            <DealRoom 
                messages={mockMessages} 
                onSendMessage={mockSendMessage} 
                onMarkAsRead={mockMarkAsRead} 
                currentUser={{id: '123', role: 'founder', name: 'Jane Smith'}}
            />
        );
        
        const messageInput = screen.getByPlaceholderText('Type your message...');
        const sendButton = screen.getByText('Send');
        
        fireEvent.change(messageInput, { target: { value: 'New test message' }});
        fireEvent.click(sendButton);
        
        await waitFor(() => {
            expect(mockSendMessage).toHaveBeenCalledWith('New test message');
        });
    });

    it('should mark messages as read when viewed', async () => {
        render(
            <DealRoom 
                messages={mockMessages} 
                onSendMessage={mockSendMessage} 
                onMarkAsRead={mockMarkAsRead} 
                currentUser={{id: '123', role: 'founder', name: 'Jane Smith'}}
            />
        );
        
        // The component should mark unread messages as read upon rendering
        await waitFor(() => {
            expect(mockMarkAsRead).toHaveBeenCalledWith(['2']);
        });
    });

    it('should display different styling for different user roles', () => {
        render(
            <DealRoom 
                messages={mockMessages} 
                onSendMessage={mockSendMessage} 
                onMarkAsRead={mockMarkAsRead} 
                currentUser={{id: '123', role: 'founder', name: 'Jane Smith'}}
            />
        );
        
        // Investor message should have different styling than founder message
        const investorMessageElement = screen.getByText('Hello, I have some questions about your financial projections.').closest('div');
        const founderMessageElement = screen.getByText('Let me clarify our growth strategy for you.').closest('div');
        
        expect(investorMessageElement).toHaveClass('bg-gray-100');
        expect(founderMessageElement).toHaveClass('bg-indigo-100');
    });
});
