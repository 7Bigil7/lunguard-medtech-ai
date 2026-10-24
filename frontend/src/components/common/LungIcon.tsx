import React from 'react'

interface LungIconProps {
  className?: string
  size?: number
}

export const LungIcon: React.FC<LungIconProps> = ({ className = 'w-6 h-6', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={{ maxWidth: '100%', maxHeight: '100%', display: 'inline-block' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Trachea / Bronchi */}
      <path
        d="M24 6V22M24 16L18 20M24 16L30 20"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left lung lobe */}
      <path
        d="M22 22C17 20 10 22 9 28C8 34 11 41 17 41C21 41 23 36 23 29V22Z"
        fill="url(#lung-grad-left)"
        stroke="#06B6D4"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Right lung lobe */}
      <path
        d="M26 22C31 20 38 22 39 28C40 34 37 41 31 41C27 41 25 36 25 29V22Z"
        fill="url(#lung-grad-right)"
        stroke="#06B6D4"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Gradient definitions for glowing cyan look */}
      <defs>
        <linearGradient id="lung-grad-left" x1="9" y1="20" x2="23" y2="41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" stopOpacity="0.85" />
          <stop stopColor="#0EA5E9" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="lung-grad-right" x1="39" y1="20" x2="25" y2="41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" stopOpacity="0.85" />
          <stop stopColor="#0EA5E9" stopOpacity="0.35" />
        </linearGradient>
      </defs>
    </svg>
  )
}
