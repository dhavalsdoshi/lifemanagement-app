import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CellEditor from './CellEditor'

function makeProps(overrides = {}) {
  return {
    onChange: vi.fn(),
    onCommit: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  }
}

describe('CellEditor', () => {
  it('renders text input by default', () => {
    render(<CellEditor col={{ key: 'name', header: 'Name' }} value="foo" {...makeProps()} />)
    expect(document.querySelector('input[type="text"]')).toBeInTheDocument()
  })

  it('renders text input for type text', () => {
    render(<CellEditor col={{ key: 'name', header: 'Name', type: 'text' }} value="foo" {...makeProps()} />)
    expect(document.querySelector('input[type="text"]')).toBeInTheDocument()
  })

  it('renders date input for type date', () => {
    render(<CellEditor col={{ key: 'date', header: 'Date', type: 'date' }} value="2024-01-15" {...makeProps()} />)
    expect(document.querySelector('input[type="date"]')).toBeInTheDocument()
  })

  it('renders textarea for type textarea', () => {
    render(<CellEditor col={{ key: 'notes', header: 'Notes', type: 'textarea' }} value="long text" {...makeProps()} />)
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
  })

  it('renders number input for type number', () => {
    render(<CellEditor col={{ key: 'amount', header: 'Amount', type: 'number' }} value="42" {...makeProps()} />)
    expect(document.querySelector('input[type="number"]')).toBeInTheDocument()
  })

  it('renders url input for type url', () => {
    render(<CellEditor col={{ key: 'url', header: 'URL', type: 'url' }} value="https://example.com" {...makeProps()} />)
    expect(document.querySelector('input[type="url"]')).toBeInTheDocument()
  })

  it('renders select with options for type select', () => {
    render(
      <CellEditor
        col={{ key: 'status', header: 'Status', type: 'select', options: ['Active', 'Done'] }}
        value="Active"
        {...makeProps()}
      />
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onCommit on Enter for text input', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<CellEditor col={{ key: 'name', header: 'Name' }} value="foo" {...props} />)
    await user.keyboard('{Enter}')
    expect(props.onCommit).toHaveBeenCalled()
  })

  it('calls onCancel on Escape', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<CellEditor col={{ key: 'name', header: 'Name' }} value="foo" {...props} />)
    await user.keyboard('{Escape}')
    expect(props.onCancel).toHaveBeenCalled()
  })

  it('calls onCommit on blur', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(
      <div>
        <CellEditor col={{ key: 'name', header: 'Name' }} value="foo" {...props} />
        <button>other</button>
      </div>
    )
    await user.click(screen.getByText('other'))
    expect(props.onCommit).toHaveBeenCalled()
  })

  it('does not commit on Enter for textarea', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<CellEditor col={{ key: 'notes', header: 'Notes', type: 'textarea' }} value="text" {...props} />)
    await user.keyboard('{Enter}')
    expect(props.onCommit).not.toHaveBeenCalled()
  })

  it('calls onCommit with value immediately on select change', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(
      <CellEditor
        col={{ key: 'status', header: 'Status', type: 'select', options: ['Active', 'Done'] }}
        value="Active"
        {...props}
      />
    )
    await user.selectOptions(screen.getByRole('combobox'), 'Done')
    expect(props.onCommit).toHaveBeenCalledWith('Done')
  })

  it('calls onChange as user types', async () => {
    const user = userEvent.setup()
    const props = makeProps()
    render(<CellEditor col={{ key: 'name', header: 'Name' }} value="" {...props} />)
    await user.type(document.querySelector('input'), 'hello')
    expect(props.onChange).toHaveBeenCalled()
  })
})
