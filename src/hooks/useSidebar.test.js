import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSidebar } from './useSidebar'

describe('useSidebar', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useSidebar())
    expect(result.current.isOpen).toBe(false)
  })

  it('open() sets isOpen to true', () => {
    const { result } = renderHook(() => useSidebar())
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
  })

  it('close() sets isOpen to false', () => {
    const { result } = renderHook(() => useSidebar())
    act(() => result.current.open())
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('toggle() flips state', () => {
    const { result } = renderHook(() => useSidebar())
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.toggle())
    expect(result.current.isOpen).toBe(false)
  })

  it('closes when pathname changes', () => {
    const { result, rerender } = renderHook(({ path }) => useSidebar(path), {
      initialProps: { path: '/weekly-goals' },
    })
    act(() => result.current.open())
    expect(result.current.isOpen).toBe(true)
    rerender({ path: '/budget' })
    expect(result.current.isOpen).toBe(false)
  })
})
