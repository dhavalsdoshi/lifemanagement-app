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
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('clicking Import opens the format menu with Excel and Markdown options', async () => {
    const user = userEvent.setup()
    renderSidebar()
    await user.click(screen.getByRole('button', { name: /import/i }))
    expect(screen.getByRole('button', { name: /excel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /markdown/i })).toBeInTheDocument()
  })

  it('clicking Export opens the format menu with Excel and Markdown options', async () => {
    const user = userEvent.setup()
    renderSidebar()
    await user.click(screen.getByRole('button', { name: /export/i }))
    expect(screen.getByRole('button', { name: /excel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /markdown/i })).toBeInTheDocument()
  })

  it('Excel export option calls onExport', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()
    renderSidebar({ onExport })
    await user.click(screen.getByRole('button', { name: /export/i }))
    await user.click(screen.getByRole('button', { name: /excel/i }))
    expect(onExport).toHaveBeenCalledOnce()
  })

  it('Markdown export option calls onMarkdownExport', async () => {
    const user = userEvent.setup()
    const onMarkdownExport = vi.fn()
    renderSidebar({ onMarkdownExport })
    await user.click(screen.getByRole('button', { name: /export/i }))
    await user.click(screen.getByRole('button', { name: /markdown/i }))
    expect(onMarkdownExport).toHaveBeenCalledOnce()
  })

  it('has xlsx and zip file inputs in the DOM', () => {
    renderSidebar()
    expect(document.querySelector('input[accept=".xlsx,.xls"]')).toBeInTheDocument()
    expect(document.querySelector('input[accept=".zip"]')).toBeInTheDocument()
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
