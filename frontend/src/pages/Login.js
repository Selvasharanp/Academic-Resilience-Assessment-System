import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Perform Login
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // 2. Save User Info to LocalStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('userName', res.data.name);
            
            // 3. Fetch History to check if they are a first-time user
            const historyRes = await axios.get(`http://localhost:5000/api/assessment/user-history/${res.data.userId}`);
            
            setLoading(false);

            // 4. Redirect Logic based on assessment history
            if (historyRes.data.length === 0) {
                navigate('/welcome');
            } else {
                navigate('/student-dashboard');
            }

        } catch (err) { 
            setLoading(false);
            console.error(err);
            alert("Login Failed: Please check your credentials."); 
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow-lg p-4 p-md-5 border-0 rounded-4">
                            {/* Brand/Logo Section */}
                            <div className="text-center mb-5">
                                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '70px', height: '70px' }}>
                                    <i className="bi bi-shield-lock-fill fs-2"></i>
                                </div>
                                <h2 className="fw-bold text-dark">Welcome Back</h2>
                                <p className="text-muted">Sign in to track your resilience progress</p>
                            </div>
                            
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-uppercase text-muted" style={{ letterSpacing: '1px' }}>
                                        Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg border-2 bg-light shadow-none" 
                                        placeholder="name@university.edu" 
                                        style={{ borderRadius: '12px', fontSize: '1rem' }}
                                        onChange={(e)=>setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label className="form-label fw-bold small text-uppercase text-muted" style={{ letterSpacing: '1px' }}>
                                            Password
                                        </label>
                                    </div>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg border-2 bg-light shadow-none" 
                                        placeholder="••••••••" 
                                        style={{ borderRadius: '12px', fontSize: '1rem' }}
                                        onChange={(e)=>setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                
                                <button 
                                    className="btn btn-primary w-100 py-3 fw-bold shadow-sm transition-all" 
                                    style={{ borderRadius: '12px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : null}
                                    {loading ? 'Securing Session...' : 'Sign Into Dashboard'}
                                </button>
                            </form>
                            
                            <div className="mt-5 text-center">
                                <p className="text-muted small mb-0">Don't have an account yet?</p>
                                <Link to="/signup" className="text-primary fw-bold text-decoration-none">
                                    Create a Student Account <i className="bi bi-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>
                        
                        {/* System Footer info */}
                        <p className="text-center text-muted mt-4 small px-4">
                            By continuing, you agree to the Academic Resilience System terms and psychometric data usage policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}