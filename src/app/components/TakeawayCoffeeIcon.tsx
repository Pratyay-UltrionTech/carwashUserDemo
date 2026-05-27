import type { ImgHTMLAttributes } from 'react';
import { cn } from './ui/utils';
import takeawayCoffeeIcon from '../assets/takeaway-coffee-icon.png';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  size?: number;
};

/** Brand takeaway coffee artwork (PNG) — hero pricing & service cards. */
export function TakeawayCoffeeIcon({
  className,
  size = 20,
  alt = '',
  style,
  ...props
}: Props) {
  return (
    <img
      src={takeawayCoffeeIcon}
      alt={alt}
      width={size}
      height={size}
      className={cn('shrink-0 object-contain', className)}
      style={{
        width: size,
        height: size,
        mixBlendMode: 'multiply',
        ...style,
      }}
      aria-hidden={alt === '' ? true : undefined}
      {...props}
    />
  );
}
