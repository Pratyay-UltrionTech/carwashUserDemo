import { cn } from './ui/utils';
import { HEADING_FONT_FAMILY } from '../lib/branding';

type Props = {
  className?: string;
};

/** Text lockup for loading / auth — replaces legacy Lumi Car Spa image asset. */
export function BrandLogoMark({ className }: Props) {
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center rounded-xl px-8 py-5',
        'bg-[#0c1d3a] shadow-[0_8px_28px_rgba(12,29,58,0.22)]',
        className,
      )}
      role="img"
      aria-label="Your Car Spa"
    >
      <svg
        className="mb-3 h-7 w-auto text-[#d4dce8]"
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M8 22C18 10 28 8 38 10C48 12 58 18 68 20C78 22 88 20 98 16C104 13 110 12 112 12"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M14 22H106"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
      <p
        className="text-[1.65rem] leading-none tracking-[0.22em] text-[#c9a84c]"
        style={{ fontFamily: HEADING_FONT_FAMILY, fontWeight: 400 }}
      >
        YOUR
      </p>
      <p
        className="mt-1 text-[0.72rem] leading-none tracking-[0.38em] text-[#c9a84c]"
        style={{ fontFamily: HEADING_FONT_FAMILY, fontWeight: 400 }}
      >
        CAR SPA
      </p>
    </div>
  );
}
