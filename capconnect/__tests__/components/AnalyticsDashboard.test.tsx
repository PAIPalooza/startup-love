import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard';

// Mock data for testing
const mockMetrics = {
    investorViews: [
        { date: '2025-05-01', count: 5 },
        { date: '2025-05-02', count: 8 },
        { date: '2025-05-03', count: 12 },
        { date: '2025-05-04', count: 7 },
        { date: '2025-05-05', count: 15 },
    ],
    documentViews: [
        { date: '2025-05-01', count: 3 },
        { date: '2025-05-02', count: 6 },
        { date: '2025-05-03', count: 4 },
        { date: '2025-05-04', count: 9 },
        { date: '2025-05-05', count: 11 },
    ],
    investorEngagement: [
        { name: 'John Doe', score: 85, actions: 12 },
        { name: 'Jane Smith', score: 92, actions: 18 },
        { name: 'Robert Johnson', score: 67, actions: 5 },
    ],
};

describe('AnalyticsDashboard Component', () => {
    it('should render the analytics dashboard with charts', () => {
        render(<AnalyticsDashboard metrics={mockMetrics} />);
        
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Investor Profile Views')).toBeInTheDocument();
        expect(screen.getByText('Document Views')).toBeInTheDocument();
        expect(screen.getByText('Investor Engagement')).toBeInTheDocument();
    });

    it('should display the investor engagement table', () => {
        render(<AnalyticsDashboard metrics={mockMetrics} />);
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Robert Johnson')).toBeInTheDocument();
    });

    it('should show an export button', () => {
        render(<AnalyticsDashboard metrics={mockMetrics} />);
        
        expect(screen.getByText('Export PDF')).toBeInTheDocument();
    });

    it('should display placeholders when no data is available', () => {
        render(<AnalyticsDashboard metrics={{
            investorViews: [],
            documentViews: [],
            investorEngagement: [],
        }} />);
        
        expect(screen.getByText('No investor view data available')).toBeInTheDocument();
        expect(screen.getByText('No document view data available')).toBeInTheDocument();
        expect(screen.getByText('No investor engagement data available')).toBeInTheDocument();
    });
});
