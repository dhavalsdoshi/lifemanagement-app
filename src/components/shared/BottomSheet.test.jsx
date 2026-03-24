import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BottomSheet from './BottomSheet'

describe('BottomSheet', () => {
  it('renders nothing when closed', () => {
    render(
      <BottomSheet isOpen={false} onClose={() => {}} title="My Sheet">
        <p>Content here</p>
      </BottomSheet>
    )
    expect(screen.queryByText('Content here')).not.toBeInTheDocument()
    expect(screen.queryByText('My Sheet')).not.toBeInTheDocument()
  })

  it('renders title and children when open', () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}} title="My Sheet">
        <p>Content here</p>
      </BottomSheet>
    )
    expect(screen.getByText('My Sheet')).toBeInTheDocument()
    expect(screen.getByText('Content here')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}} title="My Sheet" footer={<button>Save</button>}>
        <p>Body</p>
      </BottomSheet>
    )
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <BottomSheet isOpen={true} onClose={onClose} title="My Sheet">
        <p>Body</p>
      </BottomSheet>
    )
    await user.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <BottomSheet isOpen={true} onClose={onClose} title="My Sheet">
        <p>Body</p>
      </BottomSheet>
    )
    await user.click(screen.getByTestId('sheet-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
