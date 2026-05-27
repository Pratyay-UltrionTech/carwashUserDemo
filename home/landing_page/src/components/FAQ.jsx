import React, { useState } from 'react';
import { scrollToContactSection } from '../utils/scrollToContact';
import './FAQ.css';

const FAQS = [
  {
    q: 'What services do you offer?',
    a: 'We offer hand car wash and detailing — express wash, premium polish, interior vacuuming, window cleaning, tyre shine, clay bar, and full interior & exterior packages. See Services & Pricing for the full list.',
  },
  {
    q: 'Do I need to book in advance?',
    a: "Walk-ins welcome, 7 days a week 9am–5pm. We recommend booking detailing online for weekends and peak times so you get your preferred slot.",
  },
  {
    q: 'Do you use eco-safe products?',
    a: "Yes. We use biodegradable, car-safe formulas that are gentle on paint and managed responsibly on-site.",
  },
  {
    q: 'Is the complimentary coffee really free?',
    a: 'Yes — on selected packages (look for the coffee icon on pricing). Drop off your car, grab your coffee, and relax while we work.',
  },
  {
    q: 'What vehicles do you service?',
    a: 'Hatchbacks, sedans, SUVs (5- and 7-seater), utes, and vans. Price varies by vehicle size.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Card, Apple Pay, Google Pay, and cash. Online bookings are paid securely through our portal.',
  },
  {
    q: 'Where are you located?',
    a: '16/35 Coonara Avenue, West Pennant Hills NSW 2125 — next to the local shopping village.',
  },
];

function FAQEntry({ item, index, isOpen, onToggle }) {
  return (
    <div className={`faq-entry${isOpen ? ' faq-entry--open' : ''}`}>
      <button
        type="button"
        className="faq-entry-trigger"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-trigger-${index}`}
        onClick={onToggle}
      >
        <span className="faq-entry-q">{item.q}</span>
        <span className="faq-entry-toggle" aria-hidden="true" />
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className="faq-entry-panel"
        style={{ '--faq-panel-h': isOpen ? '320px' : '0px' }}
      >
        <div className="faq-entry-panel-inner">
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  );
}

const FAQ = () => {
  const [openSet, setOpenSet] = useState(() => new Set([0]));

  const toggle = (index) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="sec faq-section sec-alt-cream" id="faq" aria-labelledby="faq-heading">
      <div className="faq-shell">
        <aside className="faq-intro">
          <p className="lbl">Got questions?</p>
          <h2 id="faq-heading" className="faq-heading">
            Answers before<br />you visit
          </h2>
          <p className="faq-intro-text">
            Booking, services, and what to expect — everything in one place.
          </p>
          <p className="faq-intro-hint">
            <a href="#contact" className="faq-intro-link" onClick={scrollToContactSection}>
              Contact us
            </a>{' '}
            if you need more help.
          </p>
        </aside>

        <div className="faq-accordion">
          {FAQS.map((item, i) => (
            <FAQEntry
              key={item.q}
              item={item}
              index={i}
              isOpen={openSet.has(i)}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
