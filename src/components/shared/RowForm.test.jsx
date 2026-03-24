import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RowForm from './RowForm'

const columns = [
  { key: 'name', header: 'Name', type: 'text' },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Done'] },
  { key: 'rating', header: 'Rating', type: 'rating' },
  { key: 'notes', header: 'Notes', type: 'textarea' },
]
const values = { name: 'Task A', status: 'Active', rating: '3', notes: 'Some notes' }

describe('RowForm', () => {
  it('renders a label for each column', () => {
    render(<RowForm columns={columns} values={values} onChange={() => {}} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Rating')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('renders a text input with the current value', () => {
    render(<RowForm columns={columns} values={values} onChange={() => {}} />)
    expect(screen.getByDisplayValue('Task A')).toBeInTheDocument()
  })

  it('calls onChange when text input changes', () => {
    const onChange = vi.fn()
    render(<RowForm columns={columns} values={values} onChange={onChange} />)
    const input = screen.getByDisplayValue('Task A')
    fireEvent.change(input, { target: { value: 'Updated' } })
    expect(onChange).toHaveBeenCalledWith('name', 'Updated')
  })

  it('renders a select for select-type columns', () => {
    render(<RowForm columns={columns} values={values} onChange={() => {}} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('calls onChange when select changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RowForm columns={columns} values={values} onChange={onChange} />)
    await user.selectOptions(screen.getByRole('combobox'), 'Done')
    expect(onChange).toHaveBeenCalledWith('status', 'Done')
  })

  it('renders star buttons for rating-type columns', () => {
    render(<RowForm columns={columns} values={values} onChange={() => {}} />)
    expect(screen.getAllByRole('button', { name: /star/i })).toHaveLength(5)
  })

  it('renders a textarea for textarea-type columns', () => {
    render(<RowForm columns={columns} values={values} onChange={() => {}} />)
    const textarea = screen.getByDisplayValue('Some notes')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('calls onChange when textarea changes', () => {
    const onChange = vi.fn()
    render(<RowForm columns={columns} values={values} onChange={onChange} />)
    const textarea = screen.getByDisplayValue('Some notes')
    fireEvent.change(textarea, { target: { value: 'Updated notes' } })
    expect(onChange).toHaveBeenCalledWith('notes', 'Updated notes')
  })
})
