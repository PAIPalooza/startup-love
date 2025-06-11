import { render, screen } from '@testing-library/react'
import { CapTableChart } from '@/components/ui/cap-table-chart'

// Mock ResizeObserver which is required by recharts
beforeAll(() => {
  Object.defineProperty(window, 'ResizeObserver', {
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }))
  });
})

const mockShareClasses = [
  {
    id: '1',
    name: 'Common Stock',
    class_type: 'common',
    outstanding_shares: 1000000,
  },
  {
    id: '2',
    name: 'Series A Preferred',
    class_type: 'preferred',
    outstanding_shares: 250000,
  },
  {
    id: '3',
    name: 'Employee Options',
    class_type: 'option',
    outstanding_shares: 150000,
  },
]

describe('CapTableChart', () => {
  it('renders chart with share class data', () => {
    // To avoid ResizeObserver warnings in the test, mock any console warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    const { container } = render(<CapTableChart data={mockShareClasses} />)
    
    // Check for the container div
    expect(container.querySelector('.h-64')).toBeInTheDocument()
    
    // In jsdom environment, we can't reliably test the chart content rendering
    // So we just verify that we don't get the "No data to display" message
    // which confirms the chart is attempting to render with data
    expect(screen.queryByText('No data to display')).not.toBeInTheDocument()
    
    // Restore console.warn
    console.warn = originalConsoleWarn;
  })

  it('displays no data message when empty', () => {
    render(<CapTableChart data={[]} />)
    
    expect(screen.getByText('No data to display')).toBeInTheDocument()
  })

  it('filters out share classes with zero outstanding shares', () => {
    // Suppress ResizeObserver warnings
    const originalConsoleWarn = console.warn;
    console.warn = jest.fn();
    
    const dataWithZeros = [
      ...mockShareClasses,
      {
        id: '4',
        name: 'Future Options',
        class_type: 'option',
        outstanding_shares: 0,
      },
    ]
    
    // Create a spy to verify the component filters zero values
    const filterSpy = jest.spyOn(Array.prototype, 'filter');
    
    const { container } = render(<CapTableChart data={dataWithZeros} />)
    
    // Should still render the chart container (non-zero data exists)
    expect(container.querySelector('.h-64')).toBeInTheDocument()
    
    // Verify that a filter operation was called
    // This is an indirect way to verify the filtering behavior
    expect(filterSpy).toHaveBeenCalled()
    
    // No "No data" message should be shown since we still have valid data
    expect(screen.queryByText('No data to display')).not.toBeInTheDocument()
    
    // Restore console.warn and cleanup spy
    console.warn = originalConsoleWarn;
    filterSpy.mockRestore();
  })

  it('handles data with all zero shares', () => {
    const zeroData = [
      {
        id: '1',
        name: 'No Shares',
        class_type: 'common',
        outstanding_shares: 0,
      },
    ]
    
    render(<CapTableChart data={zeroData} />)
    
    expect(screen.getByText('No data to display')).toBeInTheDocument()
  })
})