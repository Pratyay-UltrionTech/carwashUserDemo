import React from 'react';
import { BRAND_NAME, TAGLINE } from '../../../../src/app/lib/branding';
import { AppLogo } from '../../../../src/app/components/AppLogo';
import { scrollToLandingSection } from '../utils/scrollToContact';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nb">
        <div className="ni">
          <AppLogo variant="landingNav" className="ni-logo" />
        </div>
        <div className="nn">
          {BRAND_NAME}
          <small>{TAGLINE}</small>
        </div>
      </div>
      <div className="nr">
        <ul className="nl">
          <li><a href="#svc" onClick={(e) => scrollToLandingSection('svc', e)}>Services</a></li>
          <li><a href="#pricing" onClick={(e) => scrollToLandingSection('pricing', e)}>Pricing</a></li>
          <li><a href="#why" onClick={(e) => scrollToLandingSection('why', e)}>Why Us</a></li>
          <li><a href="#nbhd" onClick={(e) => scrollToLandingSection('nbhd', e)}>Community</a></li>
          <li><a href="#faq" onClick={(e) => scrollToLandingSection('faq', e)}>FAQ</a></li>
          <li><a href="#contact" onClick={(e) => scrollToLandingSection('contact', e)}>Contact</a></li>
        </ul>
        <a href="#/login" className="nbtn">Book Now</a>
      </div>
    </nav>
  );
};

export default Navbar;
