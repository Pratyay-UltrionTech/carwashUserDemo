import React from 'react';
import './Neighborhood.css';

const NEARBY_PLACES = [
  {
    name: 'Hillside Brew Co.',
    category: 'Coffee & brunch',
    distance: '2 min walk',
    desc: 'Neighbourhood espresso bar — perfect for redeeming your complimentary coffee voucher.',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
    mapsUrl: 'https://maps.google.com/?q=Hillside+Brew+Co+West+Pennant+Hills',
    objectPosition: 'center',
  },
  {
    name: 'Greenleaf Grocer',
    category: 'Fresh produce',
    distance: '3 min walk',
    desc: 'Pick up fruit, bread and essentials while your car is in the bay.',
    img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80',
    mapsUrl: 'https://maps.google.com/?q=Greenleaf+Grocer+West+Pennant+Hills',
    objectPosition: 'center',
  },
  {
    name: 'The Corner Oven',
    category: 'Artisan bakery',
    distance: '4 min walk',
    desc: 'Warm pastries, pies and barista coffee from a local Hills favourite.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    mapsUrl: 'https://maps.google.com/?q=The+Corner+Oven+West+Pennant+Hills',
    objectPosition: 'center 40%',
  },
  {
    name: 'Blue Gum Park',
    category: 'Park & walk',
    distance: '5 min walk',
    desc: 'Shaded paths and open green space — stretch your legs while you wait.',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    mapsUrl: 'https://maps.google.com/?q=Blue+Gum+Park+West+Pennant+Hills',
    objectPosition: 'center',
  },
  {
    name: 'Cherrybrook Plaza',
    category: 'Shopping',
    distance: '8 min drive',
    desc: 'Boutiques, lunch spots and everyday retail a short drive from Coonara Avenue.',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    mapsUrl: 'https://maps.google.com/?q=Cherrybrook+Plaza+NSW',
    objectPosition: 'center',
  },
  {
    name: 'Laneway Kitchen',
    category: 'Casual dining',
    distance: '6 min drive',
    desc: 'Sit-down lunch or takeaway — ideal during longer detail appointments.',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    mapsUrl: 'https://maps.google.com/?q=Laneway+Kitchen+Pennant+Hills',
    objectPosition: 'center 35%',
  },
];

const SERVICE_AREAS = [
  'West Pennant Hills',
  'Pennant Hills',
  'Cherrybrook',
  'Castle Hill',
  'Beecroft',
  'Carlingford',
  'Thornleigh',
  'Baulkham Hills',
  'North Rocks',
  'Dural',
];

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const Neighborhood = () => {
  return (
    <section className="sec nb-section" id="nbhd">
      <div className="nb-inner">
        <header className="nb-head">
          <div className="lbl lbldk">Your Neighbourhood</div>
          <h2 className="dk">Drop your car. Explore the Hills.</h2>
          <p className="sub subdk">
            We are at 16/35 Coonara Avenue, West Pennant Hills — surrounded by cafés, green space and
            local shops. Your wait becomes free time in a precinct built for locals.
          </p>
        </header>

        <div className="nb-places">
          {NEARBY_PLACES.map((place) => (
            <a
              key={place.name}
              className="nb-place"
              href={place.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${place.name} in Google Maps`}
            >
              <img
                src={place.img}
                alt={place.name}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: place.objectPosition || 'center' }}
              />
              <div className="nb-place-overlay">
                <div className="nb-place-meta">
                  <span className="nb-place-category">{place.category}</span>
                  <span className="nb-place-distance">
                    <IconPin />
                    {place.distance}
                  </span>
                </div>
                <h3 className="nb-place-name">{place.name}</h3>
                <p className="nb-place-desc">{place.desc}</p>
                <span className="nb-place-link" aria-hidden="true">
                  View on Maps ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="nb-areas">
          <div className="nb-areas-copy">
            <p className="nb-areas-kicker">Hills District coverage</p>
            <h3 className="nb-areas-title">Proudly serving your suburb</h3>
            <p className="nb-areas-text">
              Hand wash customers travel from across the Hills — branch visits, repeat bookings
              and word-of-mouth from neighbours who trust a local business.
            </p>
          </div>
          <ul className="nb-areas-list" aria-label="Suburbs we serve">
            {SERVICE_AREAS.map((suburb) => (
              <li key={suburb} className="nb-areas-chip">
                {suburb}
              </li>
            ))}
          </ul>
        </div>

        <div className="nb-cta">
          <a href="#/login" className="bg">
            Book your wash
            <IconArrow />
          </a>
          <p>
            Complimentary coffee on eligible services — redeemable at Hillside Brew Co. and other
            local partners while you wait.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Neighborhood;
