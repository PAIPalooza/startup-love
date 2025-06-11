import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DealRoom } from '@/components/ui/deal-room';

// Mock scrollIntoView which isn't available in the test environment
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Define mock messages that match the component interface
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

  it('should mark unread messages as read when rendered', () => {
    render(
      <DealRoom 
        messages={mockMessages} 
        onSendMessage={mockSendMessage} 
        onMarkAsRead={mockMarkAsRead} 
        currentUser={{id: '123', role: 'founder', name: 'Jane Smith'}}
      />
    );
    
    // Test that the markAsRead function is called with the unread message IDs
    expect(mockMarkAsRead).toHaveBeenCalledWith(['2']);
  });

  it('should send a new message when submitting the form', () => {
    render(
      <DealRoom 
        messages={mockMessages} 
        onSendMessage={mockSendMessage} 
        onMarkAsRead={mockMarkAsRead} 
        currentUser={{id: '123', role: 'founder', name: 'Jane Smith'}}
      />
    );
    
    // Type a new message
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'New test message' } });
    
    // Submit the form
    const sendButton = screen.getByText('Send');
    fireEvent.click(sendButton);
    
    // Check that sendMessage was called with the correct content
    expect(mockSendMessage).toHaveBeenCalledWith('New test message');
  });

  it('should display correct styling for sender vs receiver messages', () => {
    render(
      <DealRoom 
        messages={mockMessages} 
        onSendMessage={mockSendMessage} 
        onMarkAsRead={mockMarkAsRead} 
        currentUser={{id: '123', role: 'investor', name: 'John Doe'}}
      />
    );
    
    // Get all message containers
    const messageElements = screen.getAllByText(/Hello|Let me clarify/i);
    
    // Check that the first message (from investor) is styled as 'own' message
    const investorMessageContainer = messageElements[0].closest('div');
    expect(investorMessageContainer).toHaveClass('bg-indigo-100');
    
    // Check that the second message (from founder) is styled as 'other' message
    const founderMessageContainer = messageElements[1].closest('div');
    expect(founderMessageContainer).toHaveClass('bg-gray-100');
  });
});
