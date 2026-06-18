import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import heroAssetUrl from '../assets/hero.png?url';
import heroVideo from '../assets/hero-video.mp4';
import { absoluteAssetUrl, getSiteOrigin } from '../seo/siteConfig';
import { BRAND_NAME } from '../../../../src/app/lib/branding';
import { API_BASE } from '../../../../src/app/lib/apiBase';
import { BRAND_PHONE } from '../config/brand';
import { scrollToLandingSection } from '../utils/scrollToContact';
import './Hero.css';

/* ── Inline SVG icons (no external dep) ── */
function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

const SEO_TITLE = `${BRAND_NAME} | Premium Hand Car Wash & Detailing`;
const SEO_DESCRIPTION = `${BRAND_NAME} — premium hand car wash, interior vacuuming, window cleaning, tire shine, and luxury detailing. Eco-safe products; complimentary coffee on selected services.`;

const HERO_STATS = [
  { value: '850+', label: 'Happy Cars' },
  { value: '4 Yrs', label: 'Serving WPH' },
  { value: '100%', label: 'Eco-Safe' },
  { value: '7 Days', label: '9am–5pm' },
];

const Hero = () => {
  /* ── Dynamic phone: fetched from branch settings, falls back to branding const ── */
  const [contactPhone, setContactPhone] = useState(BRAND_PHONE);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/public/branches`);
        if (!res.ok) return;
        const branches = await res.json();
        const phone = branches?.[0]?.phone;
        if (phone) {
          // Strip all non-digits, ensure it's a valid E.164 number
          const digits = String(phone).replace(/\D/g, '');
          if (digits.length >= 8) setContactPhone(digits);
        }
      } catch {
        // silently keep fallback
      }
    })();
  }, []);

  /* WhatsApp link — same number, pre-filled message */
  const waMessage = encodeURIComponent(`Hi, I'd like to book a service at ${BRAND_NAME}`);
  const waHref = `https://wa.me/${contactPhone}?text=${waMessage}`;
  const telHref = `tel:+${contactPhone}`;

  const scrollToServices = (event) => {
    scrollToLandingSection('svc', event);
  };

  /* ── Scroll to contact/inquiry form with navbar offset ── */
  const scrollToInquiry = () => {
    scrollToLandingSection('contact');
  };

  const origin = getSiteOrigin();
  const base = import.meta.env.BASE_URL || '/';
  const canonicalUrl = new URL(base, `${origin}/`).href;
  const heroImageAbsolute = absoluteAssetUrl(heroAssetUrl, origin);
  const defaultOgFallback = 'https://www.coonaraprofessionalhandcarwash.com.au/og-image.jpg';
  const ogImageUrl = heroImageAbsolute.includes('localhost') ? defaultOgFallback : heroImageAbsolute;

  return (
    <>
      <Helmet prioritizeSeoTags htmlAttributes={{ lang: 'en-AU' }}>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${BRAND_NAME} | West Pennant Hills`} />
        <meta
          property="og:description"
          content={`${BRAND_NAME} — premium hand wash, interior vacuuming, detailing, and eco-safe products in West Pennant Hills. Open Mon–Sun 9am–5pm.`}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_AU" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${BRAND_NAME} | West Pennant Hills`} />
        <meta
          name="twitter:description"
          content={`Premium hand car wash and detailing at ${BRAND_NAME} — West Pennant Hills. Eco-safe products; coffee on selected services.`}
        />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>
      <section className="hero" role="banner" aria-label={`${BRAND_NAME} — hero`}>
        <div className="hero-img" aria-hidden="true">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className="hero-ov" aria-hidden="true" />
        <div className="hero-glow hero-glow--1" aria-hidden="true" />
        <div className="hero-glow hero-glow--2" aria-hidden="true" />
        <div className="hc">
          <div className="hc-main lp-reveal">
            <div className="hbadge">Open 7 Days · West Pennant Hills</div>

            <h1>
              Your Car<em>wash</em>
            </h1>

            <p className="htagline">
              Premium hand wash &amp; detailing — book online in minutes.
            </p>

            <ul className="hpills" aria-label="Service highlights">
              <li>Hand wash</li>
              <li>Interior care</li>
              <li>Eco-safe products</li>
            </ul>

            <div className="hbtns">
              <a href="#/login" className="bg hbtn-primary" aria-label="Book online — sign in">
                <CalendarIcon />
                Book Online
              </a>
              <a
                href="#svc"
                className="bgh hbtn-secondary"
                onClick={scrollToServices}
                aria-label="Scroll to our services"
              >
                View Services
              </a>
            </div>

            <div className="h-contact-bar" role="group" aria-label="Quick contact options">
              <span className="h-contact-label">Or reach us directly</span>
              <div className="h-action-btns">
                <a href={telHref} className="h-action-btn h-action-btn--call" aria-label="Call us now">
                  <span className="h-action-icon"><PhoneIcon /></span>
                  <span className="h-action-label">Call</span>
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-action-btn h-action-btn--wa"
                  aria-label="Chat with us on WhatsApp"
                >
                  <span className="h-action-icon"><WhatsAppIcon /></span>
                  <span className="h-action-label">WhatsApp</span>
                </a>
                <button
                  type="button"
                  className="h-action-btn h-action-btn--inquiry"
                  onClick={scrollToInquiry}
                  aria-label="Email inquiry — scroll to contact form"
                >
                  <span className="h-action-icon"><EmailIcon /></span>
                  <span className="h-action-label">Email</span>
                </button>
              </div>
            </div>
          </div>

          <aside className="hero-stats-panel lp-reveal" aria-label="Service highlights" style={{ animationDelay: '0.12s' }}>
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hstat-card">
                <span className="sn">{stat.value}</span>
                <span className="sl">{stat.label}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
};

export default Hero;
