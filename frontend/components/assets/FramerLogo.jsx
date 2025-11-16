const FarmerLogo = ({ width = 100, height = 100, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sun */}
      <circle cx="50" cy="50" r="48" fill="#FFA500" />
      <circle cx="50" cy="50" r="40" fill="#FFD700" />

      {/* Field */}
      <path d="M0 70 Q 50 40 100 70 L 100 100 L 0 100 Z" fill="#4CAF50" />

      {/* Wheat stalks */}
      <g transform="translate(30, 50) rotate(-15)">
        <path d="M0 0 Q 5 -10 10 0 Q 15 -10 20 0" stroke="#8B4513" strokeWidth="2" fill="none" />
        <path d="M10 0 V 20" stroke="#8B4513" strokeWidth="2" />
      </g>
      <g transform="translate(50, 45) rotate(0)">
        <path d="M0 0 Q 5 -10 10 0 Q 15 -10 20 0" stroke="#8B4513" strokeWidth="2" fill="none" />
        <path d="M10 0 V 25" stroke="#8B4513" strokeWidth="2" />
      </g>
      <g transform="translate(70, 50) rotate(15)">
        <path d="M0 0 Q 5 -10 10 0 Q 15 -10 20 0" stroke="#8B4513" strokeWidth="2" fill="none" />
        <path d="M10 0 V 20" stroke="#8B4513" strokeWidth="2" />
      </g>

      {/* Tractor */}
      <g transform="translate(15, 75) scale(0.6)">
        <rect x="0" y="0" width="30" height="15" fill="#FF0000" />
        <circle cx="5" cy="15" r="5" fill="#333" />
        <circle cx="25" cy="15" r="8" fill="#333" />
      </g>
    </svg>
  )
}

export default FarmerLogo

