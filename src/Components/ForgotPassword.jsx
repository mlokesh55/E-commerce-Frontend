import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`https://localhost:7046/api/User/${email}`, {
        password: password,
      });

      if (response.status === 200) {
        setMessage('Password updated successfully!');
      }
    } catch (error) {
      setMessage('Error updating password. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        {message && <div style={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>Update Password</button>
        </form>
        <div style={styles.footer}>
          Return to <Link to="/login" style={styles.login}>Login</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh", 
    backgroundColor: "#f0f4f8" 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: "30px", 
    borderRadius: "10px", 
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", 
    textAlign: "center", 
    width: "350px" 
  },
  title: { 
    fontSize: "24px", 
    marginBottom: "20px", 
    color: "#333" 
  },
  input: { 
    width: "100%", 
    padding: "12px", 
    margin: "10px 0", 
    border: "1px solid #ccc", 
    borderRadius: "5px", 
    fontSize: "16px" 
  },
  submitButton: {
    background: '#5E5DF0',
    borderRadius: '999px',
    boxShadow: '0 4px 10px rgba(94, 93, 240, 0.2)',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '24px',
    padding: '10px 20px',
    marginTop: '10px',
    border: 'none',
    width: '100%',
    transition: 'background 0.3s ease',
  },
  login: {
    color: "#5E5DF0",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s ease",
    marginLeft: '5px',
  },
  message: { 
    color: "green", 
    marginBottom: "10px" 
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#333',
  }
};

export default ForgotPassword;