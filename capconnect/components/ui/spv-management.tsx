'use client'

import React, { useState } from 'react';
import { ChevronRight, Info, AlertCircle } from 'lucide-react';

interface SpvItem {
    id: string;
    name: string;
    target_amount: number;
    raised_amount: number;
    status: string;
    company_name: string;
    expiry_date: string;
    min_investment: number;
    participants: number;
    description: string;
}

interface SpvManagementProps {
    spvs: SpvItem[];
    onJoinSpv: (spvId: string) => void;
    onViewDetails: (spvId: string) => void;
}

export function SpvManagement({ spvs, onJoinSpv, onViewDetails }: SpvManagementProps) {
    const [expandedSpvId, setExpandedSpvId] = useState<string | null>(null);
    
    // Calculate days left until expiry
    const calculateDaysLeft = (expiryDateStr: string) => {
        const today = new Date();
        const expiryDate = new Date(expiryDateStr);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    
    // Toggle expanded view for an SPV
    const toggleExpand = (id: string) => {
        setExpandedSpvId(expandedSpvId === id ? null : id);
    };
    
    // Calculate progress percentage
    const calculateProgress = (raised: number, target: number) => {
        return Math.min(100, Math.round((raised / target) * 100));
    };
    
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Available SPVs</h2>
                <p className="text-gray-500 mt-1">Join special purpose vehicles to invest in promising startups</p>
            </div>
            
            <div className="p-6">
                {spvs.length > 0 ? (
                    <div className="space-y-6">
                        {spvs.map((spv) => (
                            <div 
                                key={spv.id} 
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                {/* SPV Summary Row */}
                                <div 
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                    onClick={() => toggleExpand(spv.id)}
                                >
                                    <div className="mb-2 md:mb-0">
                                        <h3 className="font-medium text-lg text-gray-900">{spv.name}</h3>
                                        <p className="text-sm text-gray-600">Target: {spv.company_name}</p>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            spv.status === 'open' ? 'bg-green-100 text-green-800' :
                                            spv.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                                            spv.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {spv.status === 'open' ? 'Open for Investment' :
                                             spv.status === 'filled' ? 'Fully Funded' :
                                             spv.status === 'closed' ? 'Closed' : 'Pending'}
                                        </span>
                                        
                                        {/* Expand/Collapse Indicator */}
                                        <ChevronRight className={`h-5 w-5 text-gray-400 transform transition-transform ${
                                            expandedSpvId === spv.id ? 'rotate-90' : ''
                                        }`} />
                                    </div>
                                </div>
                                
                                {/* SPV Expanded Details */}
                                {expandedSpvId === spv.id && (
                                    <div className="p-4 border-t border-gray-200">
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">{spv.description}</p>
                                            
                                            {/* Fundraising Progress */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium">${spv.raised_amount.toLocaleString()} raised</span>
                                                    <span className="text-gray-500">of ${spv.target_amount.toLocaleString()} target</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div 
                                                        className="bg-indigo-600 h-2.5 rounded-full" 
                                                        style={{ width: `${calculateProgress(spv.raised_amount, spv.target_amount)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            
                                            {/* SPV Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Minimum Investment</span>
                                                    <span className="font-medium">${spv.min_investment.toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Current Participants</span>
                                                    <span className="font-medium">{spv.participants}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Days Remaining</span>
                                                    <span className="font-medium">
                                                        {calculateDaysLeft(spv.expiry_date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-col md:flex-row gap-3 mt-4">
                                            {spv.status === 'open' && (
                                                <button
                                                    onClick={() => onJoinSpv(spv.id)}
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center"
                                                >
                                                    Join SPV
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onViewDetails(spv.id)}
                                                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md flex items-center justify-center"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No SPVs available at the moment</h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                            Check back later for new investment opportunities or contact your account manager.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
