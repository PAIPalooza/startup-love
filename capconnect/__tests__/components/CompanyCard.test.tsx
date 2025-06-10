import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanyCard } from '@/components/ui/company-card'

const mockCompany = {
  id: '1',
  name: 'Test Startup',
  industry: 'fintech',
  stage: 'seed',
  description: 'A revolutionary fintech startup',
  target_raise: 500000,
  current_raised: 100000,
  website: 'https://teststartup.com',
  users: {
    full_name: 'John Founder',
    is_verified: true,
  },
  financial_metrics: [{
    mrr: 10000,
    arr: 120000,
    burn_rate: 15000,
    runway_months: 8,
  }],
}

describe('CompanyCard', () => {
  it('renders company information correctly', () => {
    render(<CompanyCard company={mockCompany} />)
    
    expect(screen.getByText('Test Startup')).toBeInTheDocument()
    expect(screen.getByText('fintech • seed')).toBeInTheDocument()
    expect(screen.getByText('A revolutionary fintech startup')).toBeInTheDocument()
    expect(screen.getByText('$500,000')).toBeInTheDocument()
    expect(screen.getByText('Founded by John Founder')).toBeInTheDocument()
  })

  it('displays progress bar correctly', () => {
    render(<CompanyCard company={mockCompany} />)
    
    expect(screen.getByText('$100,000 raised')).toBeInTheDocument()
    expect(screen.getByText('20.0%')).toBeInTheDocument()
  })

  it('shows verified badge for verified founders', () => {
    render(<CompanyCard company={mockCompany} />)
    
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('displays financial metrics when available', () => {
    render(<CompanyCard company={mockCompany} />)
    
    expect(screen.getByText('$10,000')).toBeInTheDocument() // MRR
    expect(screen.getByText('8 months')).toBeInTheDocument() // Runway
  })

  it('opens investment modal when invest button is clicked', () => {
    render(<CompanyCard company={mockCompany} />)
    
    const investButton = screen.getByText('Invest')
    fireEvent.click(investButton)
    
    expect(screen.getByText('Invest in Test Startup')).toBeInTheDocument()
    expect(screen.getByLabelText('Investment Amount ($)')).toBeInTheDocument()
  })

  it('handles investment form submission', async () => {
    render(<CompanyCard company={mockCompany} />)
    
    // Open modal
    fireEvent.click(screen.getByText('Invest'))
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Investment Amount ($)'), {
      target: { value: '25000' }
    })
    
    // Submit
    fireEvent.click(screen.getByText('Submit Investment'))
    
    await waitFor(() => {
      expect(screen.queryByText('Invest in Test Startup')).not.toBeInTheDocument()
    })
  })

  it('handles missing financial metrics gracefully', () => {
    const companyWithoutMetrics = {
      ...mockCompany,
      financial_metrics: undefined,
    }
    
    render(<CompanyCard company={companyWithoutMetrics} />)
    
    expect(screen.getByText('Test Startup')).toBeInTheDocument()
    // Should not crash when metrics are missing
  })

  it('handles zero target raise gracefully', () => {
    const companyWithoutTarget = {
      ...mockCompany,
      target_raise: 0,
    }
    
    render(<CompanyCard company={companyWithoutTarget} />)
    
    expect(screen.getByText('$0')).toBeInTheDocument()
  })
})