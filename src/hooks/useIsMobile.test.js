import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile, MOBILE_BREAKPOINT } from './useIsMobile'

function mockMatchMedia(matches) {
  const listeners = []
  const mq = {
    matches,
    addEventListener: vi.fn((_, fn) => listeners.push(fn)),
    removeEventListener: vi.fn(),
  }
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => mq),
  })
  return { mq, listeners }
}

describe('useIsMobile', () => {
  it('returns false when viewport is wider than breakpoint', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when viewport is at or below breakpoint', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('updates when the media query changes', () => {
    const { listeners } = mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
    act(() => listeners.forEach((fn) => fn({ matches: true })))
    expect(result.current).toBe(true)
  })

  it('exports MOBILE_BREAKPOINT as 767', () => {
    expect(MOBILE_BREAKPOINT).toBe(767)
  })
})
