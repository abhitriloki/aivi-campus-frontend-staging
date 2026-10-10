const AiviLogo = ({ className = "", size = 32 }: { className?: string; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 52L32 12L50 52"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24.5 40L32 32.5L40 25.5"
        stroke="hsl(174 58% 27%)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="24.5" cy="40" r="2.5" fill="hsl(174 58% 27%)" />
      <circle cx="32" cy="32.5" r="2.5" fill="hsl(174 58% 27%)" fillOpacity="0.9" />
      <circle cx="40" cy="25.5" r="2.5" fill="hsl(174 58% 27%)" />
    </svg>
  );
};

export default AiviLogo;
