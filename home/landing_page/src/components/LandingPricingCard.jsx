import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { flattenStoredServiceLines, parseServiceDetailRows } from '../../../../src/app/lib/serviceDetailsFormat';
import { LoyaltyCountedIcon } from '../../../../src/app/components/LoyaltyCountedIcon';
import { TakeawayCoffeeIcon } from '../../../../src/app/components/TakeawayCoffeeIcon';

function formatPrice(price) {
  const n = Number(price);
  return n % 1 === 0 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`;
}

function formatDuration(durationMinutes) {
  const minutes = Number(durationMinutes ?? 0);
  return minutes > 0 ? `${minutes} min` : null;
}

function FeatureList({ descriptionPoints, excludedPoints }) {
  const rows = useMemo(
    () => parseServiceDetailRows(flattenStoredServiceLines(descriptionPoints, excludedPoints)),
    [descriptionPoints, excludedPoints],
  );

  const visible = rows.filter((r) => r.kind !== 'heading').slice(0, 5);
  if (!visible.length) return null;

  return (
    <ul className="lp-price-features">
      {visible.map((row, i) => (
        <li
          key={i}
          className={`lp-price-feature${row.kind === 'excluded' ? ' lp-price-feature--off' : ''}`}
        >
          {row.kind === 'excluded' ? (
            <X size={13} strokeWidth={2.5} aria-hidden />
          ) : (
            <Check size={13} strokeWidth={3} aria-hidden />
          )}
          <span>{row.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function LandingPricingCard({
  title,
  price,
  durationMinutes,
  descriptionPoints,
  excludedPoints,
  recommended,
  freeCoffeeCount = 0,
  eligibleForLoyaltyPoints = false,
  isSelected,
  onClick,
}) {
  const priceDisplay = formatPrice(price);
  const duration = formatDuration(durationMinutes);
  const coffeeCount = Math.max(0, Math.floor(Number(freeCoffeeCount ?? 0)));
  const showRecommended = recommended === true;
  const hasPerks = coffeeCount > 0 || eligibleForLoyaltyPoints;

  return (
    <button
      type="button"
      className={`lp-price-card${isSelected ? ' lp-price-card--selected' : ''}${showRecommended ? ' lp-price-card--featured' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {isSelected ? (
        <span className="lp-price-check" aria-hidden="true">
          <Check size={14} strokeWidth={3} />
        </span>
      ) : null}

      {showRecommended ? <span className="lp-price-ribbon">Most popular</span> : null}

      <div className="lp-price-head">
        <h3 className="lp-price-name">{title}</h3>
        <div className="lp-price-amount-row">
          <span className="lp-price-amount">{priceDisplay}</span>
          {duration ? <span className="lp-price-duration">{duration}</span> : null}
        </div>
      </div>

      <div className="lp-price-body">
        {hasPerks ? (
          <div className="lp-price-perks">
            {coffeeCount > 0 ? (
              <span className="lp-price-perk lp-price-perk--coffee">
                <TakeawayCoffeeIcon size={15} />
                Coffee
              </span>
            ) : null}
            {eligibleForLoyaltyPoints ? (
              <span className="lp-price-perk lp-price-perk--loyalty">
                <LoyaltyCountedIcon size={13} />
                Loyalty
              </span>
            ) : null}
          </div>
        ) : null}

        <FeatureList descriptionPoints={descriptionPoints} excludedPoints={excludedPoints} />
      </div>
    </button>
  );
}
