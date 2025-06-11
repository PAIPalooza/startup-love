'use client'

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown } from 'lucide-react';

interface DateMetric {
    date: string;
    count: number;
}

interface EngagementMetric {
    name: string;
    score: number;
    actions: number;
}

interface AnalyticsMetrics {
    investorViews: DateMetric[];
    documentViews: DateMetric[];
    investorEngagement: EngagementMetric[];
}

interface AnalyticsDashboardProps {
    metrics: AnalyticsMetrics;
}

export function AnalyticsDashboard({ metrics }: AnalyticsDashboardProps) {
    // Format date for better display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Generate PDF report with analytics data
    const handleExportPDF = () => {
        alert('Exporting PDF report...');
        // In a real implementation, this would generate and download a PDF
    };
    
    // Function to determine relationship score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };
    
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
                <button 
                    onClick={handleExportPDF}
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export PDF
                </button>
            </div>
            
            {/* Investor Views Chart */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-800">Investor Profile Views</h3>
                {metrics.investorViews.length > 0 ? (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={metrics.investorViews.map(item => ({
                                    ...item,
                                    date: formatDate(item.date)
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    name="Views" 
                                    stroke="#6366F1" 
                                    activeDot={{ r: 8 }} 
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No investor view data available</p>
                    </div>
                )}
            </div>
            
            {/* Document Views Chart */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-gray-800">Document Views</h3>
                {metrics.documentViews.length > 0 ? (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={metrics.documentViews.map(item => ({
                                    ...item,
                                    date: formatDate(item.date)
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar 
                                    dataKey="count" 
                                    name="Views" 
                                    fill="#8884d8" 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No document view data available</p>
                    </div>
                )}
            </div>
            
            {/* Investor Engagement Table */}
            <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800">Investor Engagement</h3>
                {metrics.investorEngagement.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Investor Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Relationship Score
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recent Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {metrics.investorEngagement.map((investor, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {investor.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${getScoreColor(investor.score)}`}>
                                                {investor.score}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {investor.actions} interactions
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-32 w-full flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No investor engagement data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
