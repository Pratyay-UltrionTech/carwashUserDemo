import React, { useState } from 'react';
import { BRAND_NAME } from '../../../../src/app/lib/branding';
import { CoffeeIcon } from './CoffeeIcon';
import './ContactForm.css';

const CONTACT_PHONE = '123456789';
const CONTACT_EMAIL = 'yourcarwash@gmail.com';

const CONTACT_DETAILS = [
  {
    icon: 'pin',
    label: 'Visit us',
    value: '16/35 Coonara Avenue',
    sub: 'West Pennant Hills NSW 2125',
    href: 'https://maps.google.com/?q=16%2F35+Coonara+Avenue+West+Pennant+Hills+NSW+2125',
  },
  {
    icon: 'phone',
    label: 'Call or text',
    value: CONTACT_PHONE,
    sub: 'Mon – Sun, 9am – 5pm',
    href: `tel:${CONTACT_PHONE}`,
  },
  {
    icon: 'email',
    label: 'Email',
    value: CONTACT_EMAIL,
    sub: 'We reply within a few hours',
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: 'clock',
    label: 'Opening hours',
    value: '7 days a week',
    sub: 'Monday – Sunday · 9:00am – 5:00pm',
  },
];

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function DetailIcon({ type }) {
  if (type === 'pin') return <IconPin />;
  if (type === 'phone') return <IconPhone />;
  if (type === 'email') return <IconEmail />;
  return <IconClock />;
}

const ContactForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <section className="sec cf-section" id="contact">
      <div className="cf-inner">
        <header className="cf-head">
          <div className="lbl lbldk">Find Us &amp; Get in Touch</div>
          <h2 className="dk">We are easy to find in the Hills</h2>
          <p className="sub subdk">
            Drop in at Coonara Avenue, call, or email — {BRAND_NAME} is here seven days a week
            for hand wash, detailing, and friendly local service.
          </p>
        </header>

        <div className="cf-layout">
          <div className="cf-details">
            <div className="cf-details-list">
              {CONTACT_DETAILS.map((item) => {
                const body = (
                  <>
                    <span className="cf-detail-icon" aria-hidden="true">
                      <DetailIcon type={item.icon} />
                    </span>
                    <div className="cf-detail-copy">
                      <span className="cf-detail-label">{item.label}</span>
                      <span className="cf-detail-value">{item.value}</span>
                      {item.sub ? <span className="cf-detail-sub">{item.sub}</span> : null}
                    </div>
                  </>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      className="cf-detail-card cf-detail-card--link"
                      href={item.href}
                      target={item.icon === 'pin' ? '_blank' : undefined}
                      rel={item.icon === 'pin' ? 'noopener noreferrer' : undefined}
                    >
                      {body}
                    </a>
                  );
                }

                return (
                  <div key={item.label} className="cf-detail-card">
                    {body}
                  </div>
                );
              })}
            </div>

            <div className="cf-perk">
              <span className="cf-perk-icon" aria-hidden="true">
                <CoffeeIcon size={20} />
              </span>
              <div>
                <p className="cf-perk-title">Complimentary coffee</p>
                <p className="cf-perk-text">Included on eligible washes — redeem at Hillside Brew Co. while you wait.</p>
              </div>
            </div>

            <a
              className="cf-map-link"
              href="https://maps.google.com/?q=16%2F35+Coonara+Avenue+West+Pennant+Hills+NSW+2125"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps ↗
            </a>
          </div>

          <div className="cf-form-panel">
            <h3 className="cf-form-title">Send us a message</h3>
            <p className="cf-form-note">
              Online enquiries are coming soon. For now, call <strong>{CONTACT_PHONE}</strong> or
              email <strong>{CONTACT_EMAIL}</strong> and we will get back to you promptly.
            </p>

            <form className="cf-form" onSubmit={(e) => e.preventDefault()} noValidate>
              <div className="cf-field">
                <label htmlFor="cf-name">Your name</label>
                <input
                  id="cf-name"
                  type="text"
                  placeholder="e.g. Alex Nguyen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="cf-field-row">
                <div className="cf-field">
                  <label htmlFor="cf-phone">Phone</label>
                  <input
                    id="cf-phone"
                    type="tel"
                    placeholder="e.g. 0400 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s()-]/g, ''))}
                    autoComplete="tel"
                  />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    placeholder="e.g. you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="cf-field">
                <label htmlFor="cf-message">How can we help?</label>
                <textarea
                  id="cf-message"
                  rows={4}
                  placeholder="Tell us about your vehicle, preferred service, or preferred day…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="cf-submit" disabled>
                Submit enquiry
              </button>
              <p className="cf-submit-hint">Form submissions are temporarily unavailable — please call or email instead.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
