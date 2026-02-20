import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable'

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
})
