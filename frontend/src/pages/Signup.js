import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    // We only collect name, email, and password. Role is handled by the backend.
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            setLoading(false);
            alert("Account created successfully! Please log in to begin your assessment.");
            // Redirect to Login page as per the workflow
            navigate('/login');
        } catch (err) { 
            setLoading(false);
            alert("Error signing up. This email may already be in use or the server is offline."); 
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    <div className="card p-4 shadow border-0 rounded-4 text-start">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-success">Join ResilienceSystem</h3>
                            <p className="text-muted small">Start your academic growth journey</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    placeholder="John Doe"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control form-control-lg" 
                                    placeholder="name@university.edu"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control form-control-lg" 
                                    placeholder="Create a strong password"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required 
                                />
                            </div>

                            <button 
                                className="btn btn-success w-100 py-3 fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create My Account'}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <hr className="text-muted" />
                            <p className="text-muted small">Already registered?</p>
                            <Link to="/login" className="btn btn-outline-primary w-100 fw-bold">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}