import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImportModeModal from './ImportModeModal'

describe('ImportModeModal', () => {
  it('displays the section count in the description', () => {
    render(<ImportModeModal sectionCount={5} onAppend={() => {}} onOverwrite={() => {}} onCancel={() => {}} />)
    expect(screen.getByText(/5 sections found/i)).toBeInTheDocument()
  })

  it('uses singular "section" when count is 1', () => {
    render(<ImportModeModal sectionCount={1} onAppend={() => {}} onOverwrite={() => {}} onCancel={() => {}} />)
    expect(screen.getByText(/1 section found/i)).toBeInTheDocument()
  })

  it('renders Append and Overwrite buttons', () => {
    render(<ImportModeModal sectionCount={3} onAppend={() => {}} onOverwrite={() => {}} onCancel={() => {}} />)
    expect(screen.getByRole('button', { name: /append/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /overwrite/i })).toBeInTheDocument()
  })

  it('calls onAppend when the Append button is clicked', async () => {
    const user = userEvent.setup()
    const onAppend = vi.fn()
    render(<ImportModeModal sectionCount={3} onAppend={onAppend} onOverwrite={() => {}} onCancel={() => {}} />)
    await user.click(screen.getByRole('button', { name: /append/i }))
    expect(onAppend).toHaveBeenCalledOnce()
  })

  it('calls onOverwrite when the Overwrite button is clicked', async () => {
    const user = userEvent.setup()
    const onOverwrite = vi.fn()
    render(<ImportModeModal sectionCount={3} onAppend={() => {}} onOverwrite={onOverwrite} onCancel={() => {}} />)
    await user.click(screen.getByRole('button', { name: /overwrite/i }))
    expect(onOverwrite).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ImportModeModal sectionCount={3} onAppend={() => {}} onOverwrite={() => {}} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onCancel when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<ImportModeModal sectionCount={3} onAppend={() => {}} onOverwrite={() => {}} onCancel={onCancel} />)
    await user.click(screen.getByTestId('modal-backdrop'))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
