import React from 'react';
import { Helmet } from 'react-helmet-async';
import heroAssetUrl from '../assets/hero.png?url';
import heroVideo from '../assets/hero-video.mp4';
import { absoluteAssetUrl, getSiteOrigin } from '../seo/siteConfig';
import { CoffeeIcon } from './CoffeeIcon';
import { BRAND_NAME } from '../../../../src/app/lib/branding';
import './Hero.css';

const SEO_TITLE = `${BRAND_NAME} | West Pennant Hills | Premium Detailing`;
const SEO_DESCRIPTION = `${BRAND_NAME} in West Pennant Hills — premium hand car wash, interior vacuuming, window cleaning, tire shine, and luxury detailing. Eco-safe products; complimentary coffee on selected services. Mon–Sun 9am–5pm.`;

const Hero = () => {
  const scrollToServices = (event) => {
    event.preventDefault();
    const section = document.getElementById('svc');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        <div className="hc">
          <div className="hbadge">✦ Your Local Community Car Wash · West Pennant Hills</div>
          <h1>
            Lumi Car <em>Spa</em>
            <span className="h1-seo">
              Premium hand wash, interior vacuuming &amp; detailing — West Pennant Hills, NSW · Mon–Sun 9am–5pm
            </span>
          </h1>
          <p className="hsub">
            Eco-safe, car-safe products and careful hand work. Drop your car, enjoy a complimentary coffee on selected
            services, and relax while we look after your vehicle.
          </p>
          <div className="hbtns">
            <a href="#/login" className="bg" aria-label="Book your car wash service — sign in">
              Book Your Service
            </a>
            <a
              href="#svc"
              className="bgh"
              onClick={scrollToServices}
              aria-label="Scroll to our services — hand car wash, interior vacuuming, and detailing"
            >
              Our Services →
            </a>
          </div>
          <p className="hformer">Formerly known as Coonara Professional Hand Car Wash</p>
          <div className="hstats" aria-label="Service highlights">
            <div className="hstat">
              <span className="sn">850+</span>
              <span className="sl">Happy Cars</span>
            </div>
            <div className="hstat">
              <span className="sn">4 Yrs</span>
              <span className="sl">Serving WPH</span>
            </div>
            <div className="hstat">
              <span className="sn">100%</span>
              <span className="sl">Eco-Safe</span>
            </div>
            <div className="hstat hstat-hours">
              <div className="hstat-sn-row">
                <span className="hstat-coffee-icon" aria-hidden="true">
                  <CoffeeIcon size={16} />
                </span>
                <span className="sn">7 Days</span>
              </div>
              <span className="sl">9am–5pm</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
