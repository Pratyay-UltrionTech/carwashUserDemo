import React from 'react';
import { TakeawayCoffeeIcon } from '../../../../src/app/components/TakeawayCoffeeIcon';

/** Takeaway coffee — shared with service pricing perk badges. */
export function CoffeeIcon({ className, size = 20 }) {
  return <TakeawayCoffeeIcon className={className} size={size} />;
}
