import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top">
            <div className="container">
                {/* Brand name changed to dark/primary color to be visible */}
                <Link className="navbar-brand fw-bold fs-4 text-primary" to="/" style={{ letterSpacing: '-1px' }}>
                    Resilience<span className="text-dark">System</span>
                </Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {token && (
                            <li className="nav-item">
                                {/* Changed from btn-outline-light to btn-outline-danger or btn-danger */}
                                <button 
                                    onClick={handleLogout} 
                                    className="btn btn-outline-danger px-4 fw-bold rounded-pill shadow-sm"
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}