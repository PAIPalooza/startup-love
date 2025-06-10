import { render, screen } from '@testing-library/react'
import { CapTableChart } from '@/components/ui/cap-table-chart'

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
    render(<CapTableChart data={mockShareClasses} />)
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('displays no data message when empty', () => {
    render(<CapTableChart data={[]} />)
    
    expect(screen.getByText('No data to display')).toBeInTheDocument()
  })

  it('filters out share classes with zero outstanding shares', () => {
    const dataWithZeros = [
      ...mockShareClasses,
      {
        id: '4',
        name: 'Future Options',
        class_type: 'option',
        outstanding_shares: 0,
      },
    ]
    
    render(<CapTableChart data={dataWithZeros} />)
    
    // Should still render the chart (non-zero data exists)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
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