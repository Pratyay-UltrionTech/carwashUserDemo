import React from 'react';
import { CoffeeIcon } from './CoffeeIcon';
import { scrollToLandingSection } from '../utils/scrollToContact';
import './ServiceGrid.css';

function IconHandWash() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M5 11h14v2a7 7 0 0 1-14 0v-2z" />
      <path d="M9 17v2M15 17v2" />
    </svg>
  );
}

function IconVacuum() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="8" width="16" height="10" rx="2" />
      <path d="M8 8V5a4 4 0 0 1 8 0v3" />
      <path d="M12 12v4" />
    </svg>
  );
}

function IconWindow() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18M12 3v18" />
    </svg>
  );
}

function IconTire() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}

function IconDetail() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l2.4 4.8L20 9l-3.8 3.5L17 18l-5-2.8L7 18l.8-5.5L4 9l5.6-1.2L12 3z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const CORE_SERVICES = [
  {
    id: 'interior',
    icon: IconVacuum,
    name: 'Interior Vacuuming',
    desc: 'Seats, carpets, and boot — thoroughly cleaned by hand.',
    accent: 'teal',
  },
  {
    id: 'windows',
    icon: IconWindow,
    name: 'Window Cleaning',
    desc: 'Streak-free glass inside and out for crystal-clear visibility.',
    accent: 'cyan',
  },
  {
    id: 'tires',
    icon: IconTire,
    name: 'Tire Shining',
    desc: 'Deep clean and dress tyres for a sharp, finished look.',
    accent: 'gold',
  },
  {
    id: 'detailing',
    icon: IconDetail,
    name: 'Premium Detailing',
    desc: 'Full packages tailored to bring back that showroom finish.',
    accent: 'navy',
  },
];

const ADDON_ITEMS = [
  'Paint protection',
  'Seat & upholstery cleaning',
  'Engine bay clean',
  'Headlight restoration',
  'Odour treatment',
  'Custom packages',
];

const ServiceGrid = () => {
  const goToPricing = (event) => {
    scrollToLandingSection('pricing', event);
  };

  return (
    <>
      <aside className="coffee-strip" aria-label="Complimentary coffee offer">
        <div className="coffee-strip-inner">
          <div className="coffee-strip-visual">
            <CoffeeIcon framed frameSize="lg" size={36} />
          </div>
          <div className="coffee-strip-copy">
            <span className="coffee-strip-eyebrow">Included perk</span>
            <p className="coffee-strip-title">Complimentary coffee on selected services</p>
            <p className="coffee-strip-sub">Drop off your car, enjoy a brew while we work — redeemable at our café partner.</p>
          </div>
          <button type="button" className="coffee-strip-cta" onClick={goToPricing}>
            View eligible packages
            <IconArrow />
          </button>
        </div>
      </aside>

      <section className="sec service-section sec-alt-mesh" id="svc">
        <div className="sec-inner">
          <header className="svc-head">
            <div className="lbl">Our Services</div>
            <h2>Built around your car</h2>
            <p className="sub">
              Every service is done by hand with eco-safe products — pick a package or mix and match exactly what you need.
            </p>
          </header>

          <article className="svc-featured">
            <div className="svc-featured-icon" aria-hidden="true">
              <IconHandWash />
            </div>
            <div className="svc-featured-body">
              <span className="svc-featured-tag">Signature service</span>
              <h3 className="svc-featured-title">Hand Car Wash</h3>
              <p className="svc-featured-desc">
                A full exterior hand wash using premium microfibre and pH-neutral products — gentle on paint, tough on grime.
              </p>
            </div>
            <button type="button" className="svc-featured-link" onClick={goToPricing}>
              See pricing
              <IconArrow />
            </button>
          </article>

          <div className="svc-grid">
            {CORE_SERVICES.map(({ id, icon: Icon, name, desc, accent }) => (
              <button
                key={id}
                type="button"
                className={`svc-card svc-card--${accent}`}
                onClick={goToPricing}
              >
                <div className="svc-card-icon" aria-hidden="true">
                  <Icon />
                </div>
                <h3 className="svc-card-title">{name}</h3>
                <p className="svc-card-desc">{desc}</p>
                <span className="svc-card-cta">View packages</span>
              </button>
            ))}
          </div>

          <div className="svc-addons">
            <div className="svc-addons-head">
              <h3 className="svc-addons-title">Add-on services</h3>
              <p className="svc-addons-sub">Stack extras onto any wash or build a fully custom package.</p>
            </div>
            <ul className="svc-addon-list">
              {ADDON_ITEMS.map((item) => (
                <li key={item}>
                  <button type="button" className="svc-addon-pill" onClick={goToPricing}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <a href="#/login" className="svc-book-link bg">
              Book your service
              <IconArrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceGrid;
