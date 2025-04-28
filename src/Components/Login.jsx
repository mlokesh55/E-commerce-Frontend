import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const response = await axios.post('https://localhost:7046/api/User/Login', credentials);
            localStorage.setItem('token', response.data);
            const decodedToken = JSON.parse(atob(response.data.split('.')[1]));
            
            // Extract user information from the token
            const role = decodedToken.role;
            const email = decodedToken.email;
            const username = decodedToken.name || decodedToken.email.split('@')[0];
            const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub || decodedToken.id; // Ensure correct claim
            
            // Store user information in localStorage
            localStorage.setItem("role", role);
            localStorage.setItem("username", username);
            localStorage.setItem("email",email);
            localStorage.setItem("userId", userId); // Store userId for cart operations
            
            onLogin();
            console.log('token:', decodedToken);
            console.log("role", role);
            console.log("username", username);
            console.log("userId", userId);
            console.log("email:", email);
            if (role === 'Admin') {
                navigate('/admin-panel', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        } catch (error) {
            setError(error.response?.data.error || 'Login failed. Please check your credentials.');
        }
    };
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                {error && <div style={styles.errorMessage}>{error}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.submitButton}>Login</button>
                </form>
                <div style={styles.links}>
                    <Link to="/forgot-password" style={styles.forgotPassword}>
                        Forgot Password?
                    </Link>
                    <p style={styles.footer}>
                        Not registered? <Link to="/register" style={styles.link}>Create an account</Link>
                    </p>
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
        backgroundColor: "#CEE3D5" 
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
    links: {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
    },
    forgotPassword: {
        color: "#6c757d",
        textDecoration: "none",
        fontSize: "14px",
        transition: "color 0.3s ease"
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
    errorMessage: { 
        color: "red", 
        marginBottom: "10px" 
    },
    footer: { 
        marginTop: "15px", 
        color: "#666" 
    },
    link: { 
        color: "#007bff", 
        textDecoration: "none" 
    },
};

export default Login;