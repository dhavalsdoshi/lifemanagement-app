import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TablePage from './TablePage'

beforeEach(() => {
  localStorage.clear()
})

describe('TablePage', () => {
  it('renders title and description', () => {
    render(<TablePage storageKey="weekly-goals" title="Weekly Goals" description="Track your goals" />)
    expect(screen.getByText('Weekly Goals')).toBeInTheDocument()
    expect(screen.getByText('Track your goals')).toBeInTheDocument()
  })

  it('renders column headers from config', () => {
    render(<TablePage storageKey="weekly-goals" title="Weekly Goals" />)
    expect(screen.getByText('Goal')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('adds a row when Add Row is clicked', async () => {
    const user = userEvent.setup()
    render(<TablePage storageKey="weekly-goals" title="Weekly Goals" />)

    expect(screen.getByText(/no data/i)).toBeInTheDocument()

    await user.click(screen.getByText('Add Row'))

    expect(screen.queryByText(/no data/i)).not.toBeInTheDocument()
  })

  it('shows search input', () => {
    render(<TablePage storageKey="weekly-goals" title="Weekly Goals" />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })
})
