import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    return (
        <div className="container mt-5">
            <div className="row align-items-center" style={{ minHeight: '75vh' }}>
                {/* Left Column: Welcome Message */}
                <div className="col-md-5 text-start">
                    <h1 className="display-4 fw-bold text-primary mb-3">Welcome, {userName}!</h1>
                    <h3 className="text-secondary mb-4">Your Academic Resilience Journey Starts Here.</h3>
                    <p className="lead text-muted mb-5">
                        Academic resilience is your ability to bounce back from setbacks and keep moving toward your goals. 
                        Take your first assessment to discover your profile.
                    </p>
                    <button 
                        className="btn btn-primary btn-lg px-5 py-3 shadow fw-bold rounded-pill" 
                        onClick={() => navigate('/quiz')}
                    >
                        Take My Assessment
                    </button>
                </div>

                {/* Right Column: Carousel */}
                <div className="col-md-7">
                    <div id="arasCarousel" className="carousel slide shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#arasCarousel" data-bs-slide-to="0" className="active"></button>
                            <button type="button" data-bs-target="#arasCarousel" data-bs-slide-to="1"></button>
                            <button type="button" data-bs-target="#arasCarousel" data-bs-slide-to="2"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img 
                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80" 
                                    className="d-block w-100" 
                                    alt="Focus" 
                                    style={{ height: '450px', objectFit: 'cover' }}
                                />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3">
                                    <h5>Understand Your Perseverance</h5>
                                    <p>The ARS-30 framework identifies how likely you are to stay committed to your studies.</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img 
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" 
                                    className="d-block w-100" 
                                    alt="Study" 
                                    style={{ height: '450px', objectFit: 'cover' }}
                                />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3">
                                    <h5>Improve Help-Seeking</h5>
                                    <p>Find out if you are effectively using the resources and tutors around you.</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                                    className="d-block w-100" 
                                    alt="Goal" 
                                    style={{ height: '450px', objectFit: 'cover' }}
                                />
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3">
                                    <h5>Track Growth Over Time</h5>
                                    <p>Watch your resilience score improve as you develop better academic habits.</p>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#arasCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#arasCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}