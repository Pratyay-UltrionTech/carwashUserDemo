import { cn } from './ui/utils';
import { BrandLogoMark } from './BrandLogoMark';

type Props = {
  label?: string;
  className?: string;
};

export function BrandLoading({ label, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <BrandLogoMark />
      <div
        className="h-8 w-8 rounded-full border-[3px] border-slate-200 border-t-[#0c1d3a] animate-spin"
        aria-hidden
      />
      {label ? (
        <p className="text-[13px] font-medium text-slate-500 tracking-wide text-center">{label}</p>
      ) : null}
    </div>
  );
}
