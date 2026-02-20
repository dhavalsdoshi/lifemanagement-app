import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderWithRouter(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

describe('App routing', () => {
  it('renders Dashboard at root', () => {
    renderWithRouter('/')
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
  })

  it('renders Weekly Goals page', () => {
    renderWithRouter('/weekly-goals')
    expect(screen.getByText('Set and track your weekly goals')).toBeInTheDocument()
  })

  it('renders Budget page', () => {
    renderWithRouter('/budget')
    expect(screen.getByText('Track income and expenses')).toBeInTheDocument()
  })

  it('renders Gratitude Journal page', () => {
    renderWithRouter('/gratitude-journal')
    expect(screen.getByText("Record things you're grateful for")).toBeInTheDocument()
  })

  it('renders sidebar navigation on all pages', () => {
    renderWithRouter('/weekly-goals')
    expect(screen.getByText('Life Management')).toBeInTheDocument()
    expect(screen.getByText('Planning & Productivity')).toBeInTheDocument()
  })

  it('renders Gym page', () => {
    renderWithRouter('/gym')
    expect(screen.getByText('Track your workouts')).toBeInTheDocument()
  })

  it('renders Day Plan Guide page', () => {
    renderWithRouter('/day-plan-guide')
    expect(screen.getByText('Steps for planning your day effectively')).toBeInTheDocument()
  })
})
