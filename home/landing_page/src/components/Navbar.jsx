import React, { useEffect, useState } from 'react';
import { BRAND_NAME, TAGLINE } from '../../../../src/app/lib/branding';
import { scrollToLandingSection } from '../utils/scrollToContact';
import './Navbar.css';

const NAV_LINKS = [
  { id: 'svc', label: 'Services' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'why', label: 'Why Us' },
  { id: 'nbhd', label: 'Community' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (sectionId, event) => {
    scrollToLandingSection(sectionId, event);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="nb">
        <div className="nn">
          {BRAND_NAME}
          <small>{TAGLINE}</small>
        </div>
      </div>
      <div className="nr">
        <button
          type="button"
          className="nmenu-toggle"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="landing-mobile-nav"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className="nl">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => handleNavClick(id, e)}>{label}</a>
            </li>
          ))}
        </ul>
        <a href="#/login" className="nbtn">Book Now</a>
      </div>
      <div
        id="landing-mobile-nav"
        className={`nmobile ${isMobileMenuOpen ? 'open' : ''}`}
      >
        <ul className="nmobile-list">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => handleNavClick(id, e)}>{label}</a>
            </li>
          ))}
          <li><a href="#/login" onClick={() => setIsMobileMenuOpen(false)}>Book Now</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
