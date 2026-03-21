import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders 5 star buttons', () => {
    render(<StarRating value="3" onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('calls onChange with string value when star is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StarRating value="2" onChange={onChange} />)
    await user.click(screen.getByLabelText('4 stars'))
    expect(onChange).toHaveBeenCalledWith('4')
  })

  it('does not call onChange when readOnly', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StarRating value="3" onChange={onChange} readOnly />)
    await user.click(screen.getByLabelText('1 star'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders without crashing when value is empty', () => {
    render(<StarRating value="" onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('labels first star singular and rest plural', () => {
    render(<StarRating value="1" onChange={() => {}} />)
    expect(screen.getByLabelText('1 star')).toBeInTheDocument()
    expect(screen.getByLabelText('2 stars')).toBeInTheDocument()
  })
})
