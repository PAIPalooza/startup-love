'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    sender_name: string;
    sender_role: string;
    content: string;
    created_at: string;
    read: boolean;
}

interface User {
    id: string;
    role: string;
    name: string;
}

interface DealRoomProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    onMarkAsRead: (messageIds: string[]) => void;
    currentUser: User;
}

export function DealRoom({ messages, onSendMessage, onMarkAsRead, currentUser }: DealRoomProps) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Format timestamp to readable format
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    
    // Handle sending a new message
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };
    
    // Mark unread messages as read when viewed
    useEffect(() => {
        const unreadMessageIds = messages
            .filter(msg => !msg.read)
            .map(msg => msg.id);
            
        if (unreadMessageIds.length > 0) {
            onMarkAsRead(unreadMessageIds);
        }
        
        // Scroll to bottom when new messages arrive
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, onMarkAsRead]);
    
    return (
        <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">Deal Room</h1>
                <p className="text-sm text-gray-500">Real-time communication with your investors</p>
            </div>
            
            {/* Messages area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div 
                            key={message.id}
                            className={`flex flex-col p-3 rounded-lg max-w-[80%] ${
                                message.sender_role === currentUser.role
                                ? 'bg-indigo-100 ml-auto' 
                                : 'bg-gray-100'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium">
                                    {message.sender_name}
                                    {message.sender_role === currentUser.role && ' (You)'}
                                </p>
                                <p className="text-xs text-gray-500">{formatTime(message.created_at)}</p>
                            </div>
                            <p className="text-gray-800">{message.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No messages yet.</p>
                        <p className="text-gray-400 text-sm">Start a conversation with your investors.</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Message input area */}
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
