import React from 'react';

export const Logo = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="256" cy="256" r="256" fill="url(#gradient)" />
      <path
        d="M160 256L256 160L352 256L256 352L160 256Z"
        fill="white"
        fillRule="evenodd"
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="512"
          y2="512"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4361EE" />
          <stop offset="100%" stopColor="#7209B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};
