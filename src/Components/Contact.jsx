import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './CSS/Contact.css'; // Make sure to import the CSS file

export const Contact = () => {
  const form = useRef();
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_gn5lqs9', 'template_mssz607', form.current, {
        publicKey: 'HpsfWfUf4Oq3ishmG',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setSuccess(true); // Set success to true on successful submission
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div className="contact-container">
      <form ref={form} onSubmit={sendEmail} className="contact-form">
        <label>Name</label>
        <input type="text" name="name" />
        <label>Email</label>
        <input type="email" name="email" />
        <label>Message</label>
        <textarea name="message" />
        <input type="submit" value="Send" />
      </form>
      {success && (
        <div className="success-message">
          Successfully submitted! 😊
        </div>
      )}
    </div>
  );
};