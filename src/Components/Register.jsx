import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User' // Default role is "User"
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        console.log('Registration data:', user);

        try {
            const response = await axios.post('https://localhost:7046/api/User', {
                userName: user.userName,
                email: user.email,
                password: user.password,
                role: user.role
            });

            if (response.status === 201) {
                setTimeout(() => navigate("/login"), 1000); // Delay before navigating
            } else {
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Register Account</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <input
                            type="text"
                            name="userName"
                            value={user.userName}
                            placeholder="Username"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            placeholder="Your Email"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            placeholder="Password"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <select name="role" value={user.role} onChange={handleChange} style={styles.select}>
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div style={styles.buttonContainer}>
                        <button type="submit" style={styles.submitButton}>Register Account</button>
                    </div>
                </form>
                <p style={styles.footer}>
                    Already registered? <Link to="/login" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#CEE3D5',
        fontFamily: 'Arial, sans-serif',
        backgroundSize: 'cover',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    select: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    submitButton: {
        background: '#5E5DF0',
        borderRadius: '999px',
        boxShadow: '#5E5DF0 0 10px 20px -10px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        cursor: 'pointer',
        fontFamily: 'Inter, Helvetica, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", sans-serif',
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: '24px',
        opacity: 1,
        outline: '0 solid transparent',
        padding: '8px 18px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
        width: 'fit-content',
        wordBreak: 'break-word',
        border: 0,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    footer: {
        marginTop: '20px',
        color: '#666',
    },
    link: {
        color: '#4f46e5',
        textDecoration: 'none',
    },
};

export default Register;