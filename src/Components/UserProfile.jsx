import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    // Fetch user details from localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    setUser({
      username,
      email
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.profileImageContainer}>
          <img 
            src="https://tse1.mm.bing.net/th/id/OIP.Bv0TLZaiY5F0InRLHILiVgHaHc?w=170&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7" 
            alt="Profile" 
            style={styles.profileImage}
          />
        </div>
        <h2 style={styles.title}>User Profile</h2>
        <div style={styles.info}>
          <strong>Username:</strong> {user.username}
        </div>
        <div style={styles.info}>
          <strong>Email:</strong> {user.email}
        </div>
        <Link to="/forgot-password" style={styles.updatePasswordLink}>
          Update Password
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e0f7fa'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '400px',
    transition: 'transform 0.3s',
  },
  profileImageContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 20px',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#00796b'
  },
  info: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#555'
  },
  updatePasswordLink: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#00796b',
    color: '#ffffff',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  }
};

export default UserProfile;