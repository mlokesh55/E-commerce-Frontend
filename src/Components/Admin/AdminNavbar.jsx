// Components/Admin/AdminNavbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const adminName = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        alert('Admin logged out successfully!');
        navigate('/login', { replace: true });
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-container">
                <div className="admin-brand">
                    <FaTachometerAlt className="admin-icon" />
                    <span>Admin Dashboard</span>
                </div>

                <div className="admin-nav-items">
                    <a href="/admin-panel/dashboard" className="admin-nav-link">
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </a>
                    <a href="/admin-panel/products" className="admin-nav-link">
                        <FaBox />
                        <span>Products</span>
                    </a>
                    <a href="/admin-panel/users" className="admin-nav-link">
                        <FaUsers />
                        <span>Users</span>
                    </a>
                </div>

                <div className="admin-profile">
                    <span className="admin-name">
                        <FaUser className="admin-user-icon" />
                        {adminName}
                    </span>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;