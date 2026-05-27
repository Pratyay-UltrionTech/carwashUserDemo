import React from 'react';
import { BRAND_NAME, TAGLINE } from '../../../../src/app/lib/branding';
import { AppLogo } from '../../../../src/app/components/AppLogo';
import './Navbar.css';

const Navbar = () => {
  const scrollToSection = (sectionId) => (event) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          <li><a href="#svc" onClick={scrollToSection('svc')}>Services</a></li>
          <li><a href="#why" onClick={scrollToSection('why')}>Why Us</a></li>
          <li><a href="#nbhd" onClick={scrollToSection('nbhd')}>Community</a></li>
          <li><a href="#contact" onClick={scrollToSection('contact')}>Contact</a></li>
        </ul>
        <a href="#/login" className="nbtn">Book Now</a>
      </div>
    </nav>
  );
};

export default Navbar;
