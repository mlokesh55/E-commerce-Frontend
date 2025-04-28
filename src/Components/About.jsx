import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/About.css';

function About() {
  return (
    <div className="home-container">

      {/* About Section */}
      <section className="about-eshop">
        <h2>About E-Shop</h2>
        <p>
          At E-Shop, we are committed to providing a seamless online shopping experience. With a vast selection of products and a user-friendly interface, we make shopping easy and enjoyable.
        </p>
      </section>

      

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"E-Shop offers an amazing variety of products at great prices. Highly recommend!"</p>
            <h4>- Alex Johnson</h4>
          </div>
          <div className="testimonial-card">
            <p>"The customer service is exceptional. They resolved my issue promptly."</p>
            <h4>- Emily Davis</h4>
          </div>
          <div className="testimonial-card">
            <p>"Fast delivery and easy returns. E-Shop is my go-to online store!"</p>
            <h4>- Chris Lee</h4>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2023 E-Shop. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default About;