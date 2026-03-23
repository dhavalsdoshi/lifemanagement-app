import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from './Sidebar'

function renderSidebar(props = {}) {
  return render(<MemoryRouter><Sidebar isOpen={true} onClose={() => {}} {...props} /></MemoryRouter>)
}

describe('Sidebar', () => {
  it('renders the app title', () => {
    renderSidebar()
    expect(screen.getByText('Life Management')).toBeInTheDocument()
  })

  it('renders category headers', () => {
    renderSidebar()
    expect(screen.getByText('Planning & Productivity')).toBeInTheDocument()
    expect(screen.getByText('Life & Relationships')).toBeInTheDocument()
    expect(screen.getByText('Trackers')).toBeInTheDocument()
    expect(screen.getByText('Lists')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderSidebar()
    expect(screen.getByText('Weekly Goals')).toBeInTheDocument()
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('Gratitude Journal')).toBeInTheDocument()
  })

  it('renders import/export buttons', () => {
    renderSidebar()
    expect(screen.getByText('Import')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('calls onClose when a nav link is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderSidebar({ onClose })
    await user.click(screen.getByText('Weekly Goals'))
    expect(onClose).toHaveBeenCalled()
  })

  it('has -translate-x-full class when closed', () => {
    renderSidebar({ isOpen: false })
    const aside = screen.getByRole('complementary')
    expect(aside.className).toContain('-translate-x-full')
  })

  it('has translate-x-0 class when open', () => {
    renderSidebar({ isOpen: true })
    const aside = screen.getByRole('complementary')
    expect(aside.className).toContain('translate-x-0')
  })
})
