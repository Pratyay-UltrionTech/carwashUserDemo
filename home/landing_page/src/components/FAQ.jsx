import React, { useState } from 'react';
import './FAQ.css';

const FAQS = [
  {
    q: "What services do you offer?",
    a: "We offer a full range of hand car wash and detailing services including express wash, premium polish, interior vacuuming, window cleaning, tyre shine, clay bar treatment, and full interior & exterior detail packages. See our Services & Pricing section for the complete list.",
  },
  {
    q: "Do I need to book in advance?",
    a: "Walk-ins are always welcome — we're open 7 days a week, 9am–5pm. However, for detailing packages we recommend booking online in advance to secure your preferred time slot, especially on weekends.",
  },
  {
    q: "Do you use eco-safe products?",
    a: "Yes — we exclusively use eco-safe, car-safe, biodegradable products that are gentle on your vehicle's paint and safe for the environment. All our wash water is managed responsibly on-site.",
  },
  {
    q: "Is the complimentary coffee really free?",
    a: "Absolutely! Complimentary takeaway coffee is included on selected service packages (look for the coffee icon on the pricing cards). Drop your car off, grab your coffee, and relax while we do the work.",
  },
  {
    q: "What vehicles do you service?",
    a: "We service all vehicle types — hatchbacks, sedans, SUVs (5-seater and 7-seater), utes, and vans. Pricing is based on vehicle size, so larger vehicles may have a slightly higher price for the same package.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, Apple Pay, Google Pay, and cash. Online bookings can be paid securely through our portal.",
  },
  {
    q: "Where are you located?",
    a: "We're located in West Pennant Hills, NSW — conveniently next to the local shopping village so you can grab a coffee or run errands while we look after your car. Exact address details are available on the contact section below.",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`faq-chevron${open ? ' faq-chevron--open' : ''}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ item, isOpen, onToggle, index }) {
  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button
        type="button"
        className="faq-trigger"
        aria-expanded={isOpen}
        aria-controls={`faq-body-${index}`}
        id={`faq-trigger-${index}`}
        onClick={onToggle}
      >
        <span className="faq-q">{item.q}</span>
        <span className="faq-icon">
          <ChevronIcon open={isOpen} />
        </span>
      </button>
      <div
        id={`faq-body-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
        className="faq-body"
        style={{ '--faq-max-h': isOpen ? '400px' : '0px' }}
      >
        <p className="faq-a">{item.a}</p>
      </div>
    </div>
  );
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section className="sec faq-section" id="faq" aria-label="Frequently asked questions">
      <div className="faq-inner">
        <div className="faq-header">
          <div className="lbl">Got Questions?</div>
          <h2>Frequently Asked Questions</h2>
          <p className="sub faq-sub">
            Everything you need to know about our services, booking, and what to expect.
          </p>
        </div>

        <div className="faq-list" role="list">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        <p className="faq-cta-line">
          Still have questions?{' '}
          <a href="#contact" className="faq-cta-link">
            Send us a quick message
          </a>
          {' '}or{' '}
          <a href="tel:+61291234567" className="faq-cta-link">
            call us directly
          </a>.
        </p>
      </div>
    </section>
  );
};

export default FAQ;
