import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  it('renders title and children', () => {
    render(<Card title="My Card"><p>Card content</p></Card>)
    expect(screen.getByText('My Card')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(<Card><p>Just content</p></Card>)
    expect(screen.getByText('Just content')).toBeInTheDocument()
  })

  it('renders action buttons when provided', () => {
    const action = <button>Click me</button>
    render(<Card title="Test" actions={action}><p>Body</p></Card>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
