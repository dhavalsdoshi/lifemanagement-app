import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FieldInput from './FieldInput'

describe('FieldInput', () => {
  it('renders a text input by default', () => {
    render(<FieldInput col={{ key: 'name', type: 'text' }} value="hello" onChange={() => {}} />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('renders a textarea for type=textarea', () => {
    render(<FieldInput col={{ key: 'notes', type: 'textarea' }} value="note" onChange={() => {}} />)
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
  })

  it('renders a select for type=select', () => {
    const col = { key: 'status', type: 'select', options: ['A', 'B'] }
    render(<FieldInput col={col} value="A" onChange={() => {}} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument()
  })

  it('calls onChange when input changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FieldInput col={{ key: 'name', type: 'text' }} value="" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'x')
    expect(onChange).toHaveBeenCalledWith('x')
  })

  it('calls onCommit on Enter for text input', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<FieldInput col={{ key: 'name', type: 'text' }} value="v" onChange={() => {}} onCommit={onCommit} />)
    await user.click(screen.getByDisplayValue('v'))
    await user.keyboard('{Enter}')
    expect(onCommit).toHaveBeenCalled()
  })

  it('calls onCancel on Escape', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<FieldInput col={{ key: 'name', type: 'text' }} value="v" onChange={() => {}} onCancel={onCancel} />)
    await user.click(screen.getByDisplayValue('v'))
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCommit with value on select change', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onCommit = vi.fn()
    const col = { key: 'status', type: 'select', options: ['A', 'B'] }
    render(<FieldInput col={col} value="A" onChange={onChange} onCommit={onCommit} />)
    await user.selectOptions(screen.getByRole('combobox'), 'B')
    expect(onChange).toHaveBeenCalledWith('B')
    expect(onCommit).toHaveBeenCalledWith('B')
  })

  it('renders <input type="number"> for type=number', () => {
    render(<FieldInput col={{ key: 'amount', type: 'number' }} value="5" onChange={() => {}} />)
    expect(document.querySelector('input[type="number"]')).toBeInTheDocument()
  })

  it('calls onChange for number input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FieldInput col={{ key: 'amount', type: 'number' }} value="" onChange={onChange} />)
    await user.type(document.querySelector('input[type="number"]'), '7')
    expect(onChange).toHaveBeenCalledWith('7')
  })

  it('renders <input type="date"> for type=date', () => {
    render(<FieldInput col={{ key: 'date', type: 'date' }} value="2024-01-01" onChange={() => {}} />)
    expect(document.querySelector('input[type="date"]')).toBeInTheDocument()
  })

  it('calls onChange for date input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FieldInput col={{ key: 'date', type: 'date' }} value="" onChange={onChange} />)
    await user.type(document.querySelector('input[type="date"]'), '2024-06-15')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders <input type="url"> for type=url', () => {
    render(<FieldInput col={{ key: 'url', type: 'url' }} value="https://example.com" onChange={() => {}} />)
    expect(document.querySelector('input[type="url"]')).toBeInTheDocument()
  })

  it('calls onChange for url input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FieldInput col={{ key: 'url', type: 'url' }} value="" onChange={onChange} />)
    await user.type(document.querySelector('input[type="url"]'), 'https://test.com')
    expect(onChange).toHaveBeenCalled()
  })
})
