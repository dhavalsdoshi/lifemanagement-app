import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0)
  const numValue = Number(value) || 0
  const display = hovered || numValue

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange(String(star))}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
          className={`p-0.5 transition-colors disabled:cursor-default focus:outline-none ${
            star <= display ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
          }`}
        >
          <Star size={16} fill={star <= display ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
}
