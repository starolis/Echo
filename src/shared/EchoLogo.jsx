import React from 'react';

const EchoLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8"/>
        <stop offset="100%" stopColor="#c084fc"/>
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#logoGrad)" strokeWidth="2.5">
      {[14, 24, 34, 44].map((r, i) => (
        <ellipse key={i} cx="50" cy="50" rx={r} ry={r * 0.85} opacity={0.25 + i * 0.2}/>
      ))}
    </g>
    <circle cx="50" cy="50" r="6" fill="url(#logoGrad)"/>
  </svg>
);

export default EchoLogo;
