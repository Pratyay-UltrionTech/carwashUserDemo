import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceGrid from './components/ServiceGrid';
import WhyUs from './components/WhyUs';
import Neighborhood from './components/Neighborhood';
import CoffeePromise from './components/CoffeePromise';
import Testimonial from './components/Testimonial';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="landing-page App">
      <Navbar />
      <Hero />
      <ServiceGrid />
      <WhyUs />
      <Neighborhood />
      <CoffeePromise />
      <Testimonial />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
