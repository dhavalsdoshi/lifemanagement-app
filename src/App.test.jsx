import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { SECTIONS } from './config/sections'

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

  it('renders sidebar navigation on all pages', () => {
    renderWithRouter('/weekly-goals')
    expect(screen.getAllByText('Life Management').length).toBeGreaterThan(0)
    expect(screen.getByText('Planning & Productivity')).toBeInTheDocument()
  })

  it('renders a hamburger menu button', () => {
    renderWithRouter('/')
    expect(screen.getByLabelText('Open navigation')).toBeInTheDocument()
  })
})

describe('All 27 section routes render without crashing', () => {
  Object.entries(SECTIONS).forEach(([key, section]) => {
    it(`renders ${section.sheetName} page at /${key}`, () => {
      renderWithRouter(`/${key}`)
      expect(screen.getByRole('heading', { name: section.sheetName })).toBeInTheDocument()
    })
  })
})
