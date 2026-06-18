import React, { useState } from 'react';
import './Testimonial.css';

const HIGHLIGHTS = [
  { value: '4.9', label: 'Average rating' },
  { value: '850+', label: 'Cars washed' },
  { value: '98%', label: 'Would recommend' },
];

const FEATURED = {
  quote:
    'Hands down the best wash in the Hills. Fair prices, spotless finish every time, and the team actually cares about the details — not just rushing you through.',
  name: 'Michael Tran',
  suburb: 'West Pennant Hills',
  service: 'Premium hand wash',
};

const REVIEWS = [
  {
    initials: 'SM',
    name: 'Sarah Mitchell',
    suburb: 'Cherrybrook',
    service: 'Interior + exterior',
    text: 'Booked online in two minutes. Car came back smelling fresh and looking showroom-ready. Will be my regular spot from now on.',
  },
  {
    initials: 'DK',
    name: 'David Kowalski',
    suburb: 'Pennant Hills',
    service: 'Ute detail',
    text: 'They got marks off my tray and tyres that I had given up on. Great value compared to the big chain washes nearby.',
  },
  {
    initials: 'PN',
    name: 'Priya Nair',
    suburb: 'Castle Hill',
    service: 'Family SUV wash',
    text: 'Kids, dogs, weekend sport — our SUV was a mess. They handled it without making me feel judged. Super friendly staff.',
  },
  {
    initials: 'LT',
    name: 'Lisa Thompson',
    suburb: 'Beecroft',
    service: 'Member wash',
    text: 'Love the loyalty program and complimentary coffee perk. Drop the car, grab a brew at Hillside Brew Co., done.',
  },
  {
    initials: 'CW',
    name: 'Chris Williams',
    suburb: 'Thornleigh',
    service: 'Walk-in wash',
    text: 'Walked in on a Saturday, still got seen quickly. Genuine hand wash — you can tell the difference on the paint straight away.',
  },
  {
    initials: 'RB',
    name: 'Rachel Brooks',
    suburb: 'Baulkham Hills',
    service: 'Full detail',
    text: 'Paint looks deeper, wheels are gleaming, interior vacuumed properly. Exactly what I paid for — no shortcuts.',
  },
];

function Stars() {
  return (
    <span className="ts-stars" aria-label="5 out of 5 stars">
      ★★★★★
    </span>
  );
}

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="ts-section sec sec-alt-mesh" id="reviews" aria-labelledby="ts-heading">
      <div className="ts-inner">
        <header className="ts-head">
          <div className="lbl">What Locals Are Saying</div>
          <h2 id="ts-heading">Trusted across the Hills</h2>
          <p className="sub">
            Real feedback from neighbours who choose a hand wash over the drive-through — and keep coming back.
          </p>
        </header>

        <div className="ts-highlights" role="list" aria-label="Review highlights">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="ts-highlight" role="listitem">
              <span className="ts-highlight-value">{item.value}</span>
              <span className="ts-highlight-label">{item.label}</span>
            </div>
          ))}
        </div>

        <blockquote className="ts-featured">
          <Stars />
          <p className="ts-featured-quote">&ldquo;{FEATURED.quote}&rdquo;</p>
          <footer className="ts-featured-meta">
            <div className="ts-avatar ts-avatar--lg" aria-hidden="true">
              {FEATURED.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <cite className="ts-featured-name">{FEATURED.name}</cite>
              <span className="ts-featured-detail">
                {FEATURED.suburb} · {FEATURED.service}
              </span>
            </div>
          </footer>
        </blockquote>

        <div className="ts-grid">
          {REVIEWS.map((review, index) => {
            const isActive = index === activeIndex;
            return (
              <article
                key={review.name}
                className={`ts-card${isActive ? ' ts-card--active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                tabIndex={0}
              >
                <Stars />
                <p className="ts-card-text">&ldquo;{review.text}&rdquo;</p>
                <footer className="ts-card-footer">
                  <div className="ts-avatar" aria-hidden="true">
                    {review.initials}
                  </div>
                  <div className="ts-card-meta">
                    <span className="ts-card-name">{review.name}</span>
                    <span className="ts-card-detail">
                      {review.suburb} · {review.service}
                    </span>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
