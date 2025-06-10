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

    it('should display SPV details correctly', () => {
        render(
            <SpvManagement 
                spvs={mockSpvs} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        // Check first SPV details
        expect(screen.getByText('TechCorp')).toBeInTheDocument();
        expect(screen.getByText('$350,000 raised')).toBeInTheDocument();
        expect(screen.getByText('of $500,000 target')).toBeInTheDocument();
        
        // Check second SPV details
        expect(screen.getByText('MediHealth')).toBeInTheDocument();
        expect(screen.getByText('$750,000 raised')).toBeInTheDocument();
        expect(screen.getByText('of $750,000 target')).toBeInTheDocument();
    });

    it('should handle join SPV button click', async () => {
        render(
            <SpvManagement 
                spvs={mockSpvs} 
                onJoinSpv={mockJoinSpv}
                onViewDetails={mockViewDetails}
            />
        );
        
        // Find the join button for the first SPV and click it
        const joinButtons = screen.getAllByText('Join SPV');
        fireEvent.click(joinButtons[0]);
        
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
        
        // Find the view details button for the second SPV and click it
        const viewDetailsButtons = screen.getAllByText('View Details');
        fireEvent.click(viewDetailsButtons[1]);
        
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
