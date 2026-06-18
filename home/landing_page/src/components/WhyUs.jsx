import React from 'react';
import { BRAND_NAME_SHORT } from '../../../../src/app/lib/branding';
import heroPoster from '../assets/hero.png';
import heroVideo from '../assets/hero-video.mp4';
import './WhyUs.css';

function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10z" />
      <path d="M2 21c0-3 1.5-5.5 4.5-7.5" />
    </svg>
  );
}

function IconHand() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      <path d="M5 11h14v2a7 7 0 0 1-14 0v-2z" />
      <path d="M9 17v2M15 17v2" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 3.8L18 8.5l-3.1 2.8.9 4.2L12 13.8 8.2 15.5l.9-4.2L6 8.5l4.1-1.7L12 3z" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

const SHOWCASE_STATS = [
  { value: '100%', label: 'Eco-safe products' },
  { value: 'By hand', label: 'No machine brushes' },
  { value: '4+ yrs', label: 'Serving the Hills' },
];

const PILLARS = [
  {
    num: '01',
    icon: IconLeaf,
    tone: 'teal',
    title: 'Eco-Friendly & Car-Safe',
    text: 'Biodegradable, non-toxic formulas gentle on paint and safe for the environment.',
  },
  {
    num: '02',
    icon: IconHand,
    tone: 'gold',
    title: 'Genuine Hand Wash',
    text: 'Every panel washed by hand with premium microfibre — no swirl marks.',
  },
  {
    num: '03',
    icon: IconSparkle,
    tone: 'cyan',
    title: 'Luxury for Every Car',
    text: 'Hatchback or prestige — the same meticulous showroom finish every time.',
  },
  {
    num: '04',
    icon: IconHome,
    tone: 'navy',
    title: 'Local & Trusted',
    text: 'West Pennant Hills owned and operated — your dollars stay in the community.',
  },
];

const WhyUs = () => {
  return (
    <section className="why-section sec sec-alt-mesh" id="why">
      <div className="why-inner">
        <header className="why-head">
          <div className="lbl">Why Choose {BRAND_NAME_SHORT}</div>
          <h2>Handcrafted care, every single wash</h2>
          <p className="sub">
            Not a drive-through. Every car washed by hand by people who care about the result as much as you do.
          </p>
        </header>

        <div className="why-showcase">
          <video
            className="why-showcase-media"
            src={heroVideo}
            poster={heroPoster}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
          <div className="why-showcase-shade" aria-hidden="true" />
          <div className="why-showcase-content">
            <p className="why-showcase-tag">See the care we put into every vehicle</p>
            <div className="why-showcase-stats" role="list" aria-label="Service highlights">
              {SHOWCASE_STATS.map((stat) => (
                <div key={stat.label} className="why-showcase-stat" role="listitem">
                  <span className="why-showcase-stat-value">{stat.value}</span>
                  <span className="why-showcase-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="why-pillars">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.num} className={`why-pillar why-pillar--${pillar.tone}`}>
                <div className="why-pillar-top">
                  <span className="why-pillar-num">{pillar.num}</span>
                  <div className="why-pillar-icon" aria-hidden="true">
                    <Icon />
                  </div>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
