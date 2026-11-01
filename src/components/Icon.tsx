const PATHS = {
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  key: 'm15.5 7.5 3 3L22 7l-3-3M21 2l-9.6 9.6M15.5 15.5a5.5 5.5 0 1 1-7.78-7.78 5.5 5.5 0 0 1 7.78 7.78Z',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 18l-6-6 6-6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  play: 'M7 4l13 8-13 8z',
  exit: 'M9 21H5V3h4M16 17l5-5-5-5M21 12H9',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  terminal: 'm4 17 6-6-6-6M12 19h8',
  upload: 'M21 15v6H3v-6M17 8l-5-5-5 5M12 3v13',
  pencil: 'M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
  clock: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  swap: 'M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16',
  code: 'm18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16',
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  bomb: 'M10.5 21.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM15.5 9l2.5-2.5M18 6.5c.5-2 2-3 3.5-2.5',
  github: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5a5.4 5.4 0 0 0-1.5-3.8c.2-1.2.2-2.4-.5-3.2 0 0-1 0-3 1.5a13 13 0 0 0-7 0C6 1 5 1 5 1c-.7.8-.7 2-.5 3.2A5.4 5.4 0 0 0 3 8c0 3.5 3 5.5 6 5.5A4.8 4.8 0 0 0 8 17v5M9 18c-4.5 2-5-2-7-2',
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill={name === 'bomb' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
