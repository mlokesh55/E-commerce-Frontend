// Components/Admin/AdminLayout.js
import React from 'react';
import AdminNavbar from './AdminNavbar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <AdminNavbar />
            <div className="admin-content">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;