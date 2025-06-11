import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsDashboard } from '@/components/ui/analytics-dashboard';

// Mock ResizeObserver which is required by recharts
beforeAll(() => {
  Object.defineProperty(window, 'ResizeObserver', {
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }))
  });
});

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
    // Add a before/after hook to suppress chart warnings for all tests
    let originalConsoleWarn: typeof console.warn;
    
    beforeAll(() => {
        originalConsoleWarn = console.warn;
        console.warn = jest.fn();
    });
    
    afterAll(() => {
        console.warn = originalConsoleWarn;
    });

    it('should render the analytics dashboard with charts', () => {
        // We just test that the component renders without errors
        const { container } = render(<AnalyticsDashboard metrics={mockMetrics} />);
        
        // Basic content assertions
        expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Investor Profile Views')).toBeInTheDocument();
        expect(screen.getByText('Document Views')).toBeInTheDocument();
        expect(screen.getByText('Investor Engagement')).toBeInTheDocument();
        
        // Check that chart containers are present (we don't need to check the specific recharts elements)
        expect(container.querySelectorAll('.h-64').length).toBeGreaterThan(0);
    });

    it('should display the investor engagement table', () => {
        render(<AnalyticsDashboard metrics={mockMetrics} />);
        
        // Check for table content
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Robert Johnson')).toBeInTheDocument();
        
        // Check for score numbers - using regex to match text that includes the percentage values
        expect(screen.getByText(/85%/)).toBeInTheDocument();
        expect(screen.getByText(/92%/)).toBeInTheDocument();
    });

    it('should show an export button', () => {
        render(<AnalyticsDashboard metrics={mockMetrics} />);
        
        // Look for the export button by its text content
        expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
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
