import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardList from './CardList'

const columns = [
  { key: 'goal', header: 'Goal', type: 'text' },
  { key: 'status', header: 'Status', type: 'select', options: ['Done', 'In Progress'] },
  { key: 'notes', header: 'Notes', type: 'textarea' },
]
const rows = [
  { id: '1', goal: 'Read a book', status: 'Done', notes: 'Great read' },
  { id: '2', goal: 'Exercise daily', status: 'In Progress', notes: '' },
]

describe('CardList', () => {
  it('renders each row title (first column) as a card heading', () => {
    render(<CardList columns={columns} rows={rows} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Read a book')).toBeInTheDocument()
    expect(screen.getByText('Exercise daily')).toBeInTheDocument()
  })

  it('shows non-textarea column values as badges', () => {
    render(<CardList columns={columns} rows={rows} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('shows textarea content as a note preview when non-empty', () => {
    render(<CardList columns={columns} rows={rows} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Great read')).toBeInTheDocument()
  })

  it('does not show a note preview when textarea is empty', () => {
    render(<CardList columns={columns} rows={[rows[1]]} onEdit={() => {}} onDelete={() => {}} />)
    // 'Exercise daily' card has no notes
    expect(screen.queryByTestId('card-note')).not.toBeInTheDocument()
  })

  it('calls onEdit with the full row when edit button is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<CardList columns={columns} rows={rows} onEdit={onEdit} onDelete={() => {}} />)
    await user.click(screen.getAllByLabelText('Edit row')[0])
    expect(onEdit).toHaveBeenCalledWith(rows[0])
  })

  it('calls onDelete with the row id when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<CardList columns={columns} rows={rows} onEdit={() => {}} onDelete={onDelete} />)
    await user.click(screen.getAllByLabelText('Delete row')[0])
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('shows empty state when rows is empty', () => {
    render(<CardList columns={columns} rows={[]} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument()
  })
})
