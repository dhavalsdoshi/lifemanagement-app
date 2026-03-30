import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable'
import { formatCellValue } from '../../utils/format'

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
]

const rows = [
  { id: '1', name: 'Task A', status: 'Done' },
  { id: '2', name: 'Task B', status: 'Pending' },
]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} rows={rows} onUpdate={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<DataTable columns={columns} rows={rows} onUpdate={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })

  it('allows inline editing on cell click', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    render(<DataTable columns={columns} rows={rows} onUpdate={onUpdate} onDelete={() => {}} />)

    await user.click(screen.getByText('Task A'))
    const input = screen.getByDisplayValue('Task A')
    await user.clear(input)
    await user.type(input, 'Updated')
    await user.keyboard('{Enter}')

    expect(onUpdate).toHaveBeenCalledWith('1', 'name', 'Updated')
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<DataTable columns={columns} rows={rows} onUpdate={() => {}} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByLabelText('Delete row')
    await user.click(deleteButtons[0])
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('filters rows based on search', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} rows={rows} onUpdate={() => {}} onDelete={() => {}} />)

    const search = screen.getByPlaceholderText('Search...')
    await user.type(search, 'Task B')

    expect(screen.queryByText('Task A')).not.toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
  })

  it('shows empty state when no rows', () => {
    render(<DataTable columns={columns} rows={[]} onUpdate={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/no data/i)).toBeInTheDocument()
  })

  it('renders date input when editing a date column', async () => {
    const user = userEvent.setup()
    const dateColumns = [{ key: 'date', header: 'Date', type: 'date' }]
    const dateRows = [{ id: '1', date: '2024-01-15' }]
    render(<DataTable columns={dateColumns} rows={dateRows} onUpdate={() => {}} onDelete={() => {}} />)
    await user.click(screen.getByText('Jan 15, 2024'))
    expect(document.querySelector('input[type="date"]')).toBeInTheDocument()
  })

  it('renders textarea when editing a textarea column', async () => {
    const user = userEvent.setup()
    const textColumns = [{ key: 'notes', header: 'Notes', type: 'textarea' }]
    const textRows = [{ id: '1', notes: 'some notes' }]
    render(<DataTable columns={textColumns} rows={textRows} onUpdate={() => {}} onDelete={() => {}} />)
    await user.click(screen.getByText('some notes'))
    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.some((el) => el.tagName === 'TEXTAREA')).toBe(true)
  })

  it('renders select when editing a select column', async () => {
    const user = userEvent.setup()
    const selectColumns = [{ key: 'status', header: 'Status', type: 'select', options: ['Active', 'Done'] }]
    const selectRows = [{ id: '1', status: 'Active' }]
    render(<DataTable columns={selectColumns} rows={selectRows} onUpdate={() => {}} onDelete={() => {}} />)
    await user.click(screen.getAllByText('Active')[0])
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('formats date values in display', () => {
    const dateColumns = [{ key: 'date', header: 'Date', type: 'date' }]
    const dateRows = [{ id: '1', date: '2024-01-15' }]
    render(<DataTable columns={dateColumns} rows={dateRows} onUpdate={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('renders star buttons for type rating column', () => {
    const ratingColumns = [{ key: 'rating', header: 'Rating', type: 'rating' }]
    const ratingRows = [{ id: '1', rating: '3' }]
    render(<DataTable columns={ratingColumns} rows={ratingRows} onUpdate={() => {}} onDelete={() => {}} />)
    expect(screen.getAllByRole('button', { name: /star/ })).toHaveLength(5)
  })

  it('calls onUpdate immediately when a star is clicked', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()
    const ratingColumns = [{ key: 'rating', header: 'Rating', type: 'rating' }]
    const ratingRows = [{ id: '1', rating: '2' }]
    render(<DataTable columns={ratingColumns} rows={ratingRows} onUpdate={onUpdate} onDelete={() => {}} />)
    await user.click(screen.getByLabelText('5 stars'))
    expect(onUpdate).toHaveBeenCalledWith('1', 'rating', '5')
  })
})

describe('formatCellValue', () => {
  it('returns empty string for falsy value', () => {
    expect(formatCellValue({ key: 'date', type: 'date' }, '')).toBe('')
    expect(formatCellValue({ key: 'date', type: 'date' }, null)).toBe('')
  })

  it('formats a valid date string', () => {
    expect(formatCellValue({ key: 'date', type: 'date' }, '2024-01-15')).toBe('Jan 15, 2024')
  })

  it('returns original value for unparseable date', () => {
    expect(formatCellValue({ key: 'date', type: 'date' }, 'not-a-date')).toBe('not-a-date')
  })

  it('returns string value for non-date types', () => {
    expect(formatCellValue({ key: 'name', type: 'text' }, 'hello')).toBe('hello')
  })
})
