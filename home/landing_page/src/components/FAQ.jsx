import React, { useEffect, useRef, useState } from 'react';
import { BRAND_NAME } from '../../../../src/app/lib/branding';
import { BRAND_PHONE } from '../config/brand';
import { scrollToContactSection } from '../utils/scrollToContact';
import './FAQ.css';

const PHONE_DISPLAY = '0449 957 777';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'booking', label: 'Booking' },
  { id: 'services', label: 'Services' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'perks', label: 'Perks' },
  { id: 'location', label: 'Location' },
];

const FAQ_ITEMS = [
  {
    id: 'book-online',
    category: 'booking',
    q: 'Can I book online?',
    a: `Yes — visit our booking portal any time to choose your service, pick a slot, and confirm instantly. Walk-ins are also welcome Mon–Sun, 9am–5pm at 16/35 Coonara Avenue.`,
  },
  {
    id: 'walk-in',
    category: 'booking',
    q: 'Do I need an appointment?',
    a: 'Walk-ins are welcome for standard washes. For detailing or busy weekends, booking ahead online is recommended to secure your preferred time.',
  },
  {
    id: 'contact',
    category: 'booking',
    q: 'How do I reach the team?',
    a: `Phone or WhatsApp: ${PHONE_DISPLAY} · Email: lumicarspa@gmail.com · Or use the contact form on this page.`,
  },
  {
    id: 'services-offered',
    category: 'services',
    q: 'What services do you offer?',
    a: `Hand exterior wash, interior vacuum, window cleaning, tyre dressing, and full detailing packages — all done by hand with eco-safe products at ${BRAND_NAME}.`,
  },
  {
    id: 'hand-vs-auto',
    category: 'services',
    q: 'Why choose hand wash over automatic?',
    a: 'Automatic brushes can cause swirl marks over time. Our trained team uses microfibre cloths and pH-neutral products for a safer, more thorough clean.',
  },
  {
    id: 'custom-package',
    category: 'services',
    q: 'Can I build a custom package?',
    a: 'Absolutely. Mix and match wash, vacuum, windows, tyres, and detailing add-ons. Ask the team on arrival or note your preferences when booking online.',
  },
  {
    id: 'pricing',
    category: 'pricing',
    q: 'How much does a wash cost?',
    a: 'Live pricing is shown on this page under Service Pricing — pulled directly from our menu. Member deals and off-peak offers can reduce your total at checkout.',
  },
  {
    id: 'member-deals',
    category: 'pricing',
    q: 'Are there member discounts?',
    a: 'Free membership unlocks loyalty rewards, day-specific offers, seasonal promotions, and better pricing on repeat visits. Sign up when you book online.',
  },
  {
    id: 'loyalty',
    category: 'perks',
    q: 'How does the loyalty program work?',
    a: 'Your washes are tracked automatically when you book as a member. Every 10th wash is free at the same service level — no paper cards required.',
  },
  {
    id: 'coffee',
    category: 'perks',
    q: 'Is complimentary coffee included?',
    a: 'Selected packages include a coffee voucher redeemable at Hillside Brew Co. and other local partners while your car is being washed.',
  },
  {
    id: 'hours',
    category: 'location',
    q: 'What are your opening hours?',
    a: 'Open 7 days a week, Monday to Sunday, 9am – 5pm. Public holiday hours may vary — call ahead to confirm.',
  },
  {
    id: 'suburbs',
    category: 'location',
    q: 'Which suburbs do you serve?',
    a: 'Customers visit from across the Hills District — West Pennant Hills, Pennant Hills, Cherrybrook, Castle Hill, Beecroft, Carlingford, Thornleigh, and surrounding areas.',
  },
];

function usePanelHeight(isOpen, deps = []) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return undefined;

    const update = () => setHeight(isOpen ? el.scrollHeight : 0);
    update();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    observer?.observe(el);
    return () => observer?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ...deps]);

  return { innerRef, height };
}

function FAQItem({ item, isOpen, onToggle }) {
  const { innerRef, height } = usePanelHeight(isOpen, [item.a]);

  return (
    <div className={`fq-item${isOpen ? ' fq-item--open' : ''}`}>
      <button
        type="button"
        className="fq-trigger"
        aria-expanded={isOpen}
        aria-controls={`fq-panel-${item.id}`}
        id={`fq-trigger-${item.id}`}
        onClick={onToggle}
      >
        <span className="fq-question">{item.q}</span>
        <span className="fq-icon" aria-hidden="true" />
      </button>
      <div
        id={`fq-panel-${item.id}`}
        role="region"
        aria-labelledby={`fq-trigger-${item.id}`}
        className="fq-panel"
        style={{ '--fq-panel-h': `${height}px` }}
      >
        <div ref={innerRef} className="fq-panel-inner">
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  );
}

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id ?? null);

  const visibleItems =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    const nextItems =
      categoryId === 'all'
        ? FAQ_ITEMS
        : FAQ_ITEMS.filter((item) => item.category === categoryId);
    setOpenId(nextItems[0]?.id ?? null);
  };

  return (
    <section className="sec fq-section sec-alt-white" id="faq" aria-labelledby="fq-heading">
      <div className="fq-inner">
        <header className="fq-head">
          <div className="lbl">Got questions?</div>
          <h2 id="fq-heading">Quick answers, no runaround</h2>
          <p className="sub">
            Everything you need to know before you book — tap a topic or open any question below.
          </p>
        </header>

        <div className="fq-filters" role="tablist" aria-label="FAQ categories">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`fq-filter${activeCategory === cat.id ? ' fq-filter--active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="fq-list" aria-label="Frequently asked questions">
          {visibleItems.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>

        <div className="fq-cta">
          <div className="fq-cta-copy">
            <p className="fq-cta-kicker">Still unsure?</p>
            <h3 className="fq-cta-title">We are happy to help before you book</h3>
            <p className="fq-cta-text">
              Call, WhatsApp, or send a message — the team usually replies within a few hours.
            </p>
          </div>
          <div className="fq-cta-actions">
            <a href={`tel:+${BRAND_PHONE}`} className="fq-cta-btn fq-cta-btn--primary">
              Call {PHONE_DISPLAY}
            </a>
            <a
              href="#contact"
              className="fq-cta-btn fq-cta-btn--secondary"
              onClick={scrollToContactSection}
            >
              Send a message
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
