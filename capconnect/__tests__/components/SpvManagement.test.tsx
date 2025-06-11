import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SpvManagement } from '@/components/ui/spv-management';

// Mock data for testing
const mockSpvs = [
    {
        id: '1',
        name: 'Tech Ventures SPV',
        target_amount: 500000,
        raised_amount: 350000,
        status: 'open',
        company_name: 'TechCorp',
        expiry_date: '2025-12-31',
        min_investment: 10000,
        participants: 8,
        description: 'SPV for investing in TechCorp Series A round'
    },
    {
        id: '2',
        name: 'Healthcare Innovation Fund',
        target_amount: 750000,
        raised_amount: 750000,
        status: 'filled',
        company_name: 'MediHealth',
        expiry_date: '2025-10-15',
        min_investment: 25000,
        participants: 12,
        description: 'SPV for investing in MediHealth Series B round'
    }
];

// Mock functions
const mockJoinSpv = jest.fn();
const mockViewDetails = jest.fn();

describe('SpvManagement Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the SPV management component with list of SPVs', () => {
        render(
            <SpvManagement 
                spvs={mockSpvs} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        expect(screen.getByText('Available SPVs')).toBeInTheDocument();
        expect(screen.getByText('Tech Ventures SPV')).toBeInTheDocument();
        expect(screen.getByText('Healthcare Innovation Fund')).toBeInTheDocument();
    });

    it('should display SPV details correctly', async () => {
        render(
            <SpvManagement 
                spvs={mockSpvs} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        // First SPV - check basic info visible without expanding
        expect(screen.getByText('Tech Ventures SPV')).toBeInTheDocument();
        expect(screen.getByText(/TechCorp/)).toBeInTheDocument(); // Target company is visible in collapsed view
        
        // Expand first SPV panel
        const techSpvPanel = screen.getByText('Tech Ventures SPV');
        fireEvent.click(techSpvPanel);
        
        // Now check for details that are only visible when expanded
        await waitFor(() => {
            expect(screen.getByText('$350,000 raised')).toBeInTheDocument();
            expect(screen.getByText('of $500,000 target')).toBeInTheDocument();
        });
        
        // Second SPV - check basic info visible without expanding
        expect(screen.getByText('Healthcare Innovation Fund')).toBeInTheDocument();
        expect(screen.getByText(/MediHealth/)).toBeInTheDocument();
        
        // Expand second SPV panel
        const healthSpvPanel = screen.getByText('Healthcare Innovation Fund');
        fireEvent.click(healthSpvPanel);
        
        // Now check for details that are only visible when expanded
        await waitFor(() => {
            expect(screen.getByText('$750,000 raised')).toBeInTheDocument();
            expect(screen.getByText('of $750,000 target')).toBeInTheDocument();
        });
    });

    it('should handle join SPV button click', async () => {
        render(
            <SpvManagement 
                spvs={mockSpvs} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        // First expand the SPV panel by clicking on its header
        const techSpvPanel = screen.getByText('Tech Ventures SPV');
        fireEvent.click(techSpvPanel);
        
        // Now that the panel is expanded, find and click the Join SPV button
        await waitFor(() => {
            const joinButton = screen.getByText('Join SPV');
            fireEvent.click(joinButton);
        });
        
        await waitFor(() => {
            expect(mockJoinSpv).toHaveBeenCalledWith('1');
        });
    });

    it('should handle view details button click', async () => {
        render(
            <SpvManagement 
                spvs={mockSpvs} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        // First expand the SPV panel by clicking on its header
        const spvPanels = screen.getAllByText(/Tech Ventures SPV|Healthcare Innovation Fund/);
        fireEvent.click(spvPanels[1]); // Click on the second SPV panel (Healthcare Innovation Fund)
        
        // Now that the panel is expanded, find and click the View Details button
        await waitFor(() => {
            const viewDetailsButton = screen.getAllByText('View Details')[0];
            fireEvent.click(viewDetailsButton);
        });
        
        await waitFor(() => {
            expect(mockViewDetails).toHaveBeenCalledWith('2');
        });
    });

    it('should display empty state when no SPVs available', () => {
        render(
            <SpvManagement 
                spvs={[]} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        expect(screen.getByText('No SPVs available at the moment')).toBeInTheDocument();
    });
});
