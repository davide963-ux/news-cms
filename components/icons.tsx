/** Small inline SVG icons — no icon library dependency, just the handful the
 * new layout needs. All inherit color from `currentColor`. */

export function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

export function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
    </svg>
  );
}

export function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.9 4.3 2.7 11.8c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.1-2 4.4 3.2c.8.5 1.4.2 1.6-.7l2.9-13.6c.3-1.2-.4-1.7-1.2-1.5ZM8.5 14.2l9.2-5.8c.4-.3.8 0 .5.3l-7.5 6.8-.3 3.1-1.4-3.5Z" />
    </svg>
  );
}

export function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.3 5.4A17.6 17.6 0 0 0 15.9 4l-.3.6a13 13 0 0 1 3.7 1.4 15 15 0 0 0-12.6 0 13 13 0 0 1 3.7-1.4L10.1 4a17.6 17.6 0 0 0-4.4 1.4C2.9 9 2.1 12.6 2.4 16.1a17.7 17.7 0 0 0 5.4 2.7l.7-1.1a11.4 11.4 0 0 1-1.8-.9l.4-.3a12.6 12.6 0 0 0 10.8 0l.4.3c-.6.3-1.2.6-1.8.9l.7 1.1a17.6 17.6 0 0 0 5.4-2.7c.4-4-.6-7.6-2.3-10.7ZM9.7 14.3c-.8 0-1.5-.8-1.5-1.7 0-1 .6-1.7 1.5-1.7.8 0 1.5.8 1.5 1.7 0 1-.7 1.7-1.5 1.7Zm4.6 0c-.8 0-1.5-.8-1.5-1.7 0-1 .6-1.7 1.5-1.7.8 0 1.5.8 1.5 1.7 0 1-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}

export function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" strokeLinecap="round" />
    </svg>
  );
}

export function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path
        d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
