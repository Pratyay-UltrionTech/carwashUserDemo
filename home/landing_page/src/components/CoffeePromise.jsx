import React from 'react';
import { BRAND_NAME } from '../../../../src/app/lib/branding';
import { CoffeeIcon } from './CoffeeIcon';
import './CoffeePromise.css';

const PERKS = [
  {
    tone: 'gold',
    label: 'Eligible services',
    value: 'Premium wash & detail packages',
    text: 'Coffee is included on select services — look for the cup icon when you book.',
  },
  {
    tone: 'teal',
    label: 'Redeem nearby',
    value: 'Sunnyside Café & local partners',
    text: 'Walk over while we wash. Voucher valid at participating cafés in the precinct.',
  },
  {
    tone: 'navy',
    label: 'No catch',
    value: 'Completely complimentary',
    text: 'Not a discount code or upsell — a genuine thank-you for choosing us.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Book an eligible wash',
    text: 'Choose a package that includes complimentary coffee at checkout.',
  },
  {
    step: '02',
    title: 'Collect your voucher',
    text: 'Your digital voucher is ready as soon as your booking is confirmed.',
  },
  {
    step: '03',
    title: 'Enjoy while you wait',
    text: 'Redeem at a local café partner — we will notify you when your car is ready.',
  },
];

const PARTNERS = ['Sunnyside Café', 'Grapa Coffee House', 'Backree Bakehouse'];

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

const CoffeePromise = () => {
  return (
    <section className="sec cp-section sec-alt-mesh" id="coffee-promise">
      <div className="cp-inner">
        <header className="cp-head">
          <div className="lbl">Included With Selected Wash</div>
          <h2>The {BRAND_NAME} Coffee Promise</h2>
          <p className="sub">
            Complimentary coffee on eligible services — relax in the neighbourhood while we
            hand-finish your car.
          </p>
        </header>

        <div className="cp-layout">
          <div className="cp-hero">
            <div className="cp-hero-glow" aria-hidden="true" />
            <div className="cp-hero-badge">
              <CoffeeIcon size={40} framed frameSize="lg" />
              <span>Complimentary</span>
            </div>
            <h3 className="cp-hero-title">Coffee on us</h3>
            <p className="cp-hero-text">
              Selected washes include a voucher for a barista coffee at our local café partners —
              because a great wash deserves a great wait.
            </p>
            <ul className="cp-hero-points">
              <li>
                <IconCheck />
                One voucher per eligible booking
              </li>
              <li>
                <IconCheck />
                Redeem while your car is in the bay
              </li>
              <li>
                <IconCheck />
                No extra cost at checkout
              </li>
            </ul>
          </div>

          <div className="cp-perks">
            {PERKS.map((perk) => (
              <article key={perk.label} className={`cp-perk cp-perk--${perk.tone}`}>
                <p className="cp-perk-label">{perk.label}</p>
                <h4 className="cp-perk-value">{perk.value}</h4>
                <p className="cp-perk-text">{perk.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="cp-steps">
          <p className="cp-steps-kicker">How it works</p>
          <div className="cp-steps-grid">
            {STEPS.map((item, index) => (
              <div key={item.step} className="cp-step">
                <div className="cp-step-top">
                  <span className="cp-step-num">{item.step}</span>
                  {index < STEPS.length - 1 ? (
                    <span className="cp-step-line" aria-hidden="true" />
                  ) : null}
                </div>
                <h4 className="cp-step-title">{item.title}</h4>
                <p className="cp-step-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cp-partners">
          <p className="cp-partners-label">Redeem at participating partners</p>
          <ul className="cp-partners-list" aria-label="Café partners">
            {PARTNERS.map((name) => (
              <li key={name} className="cp-partners-chip">
                <CoffeeIcon size={16} />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CoffeePromise;
