import React from 'react';

/** Small decorative coffee cup for hero stats and complimentary strip */
export function CoffeeIcon({ className, size = 20 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 3v2M10 3v2M14 3v2M4 9h12v8a3 3 0 01-3 3H7a3 3 0 01-3-3V9zM16 9h2a2 2 0 012 2v0a2 2 0 01-2 2h-2M6 21h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
