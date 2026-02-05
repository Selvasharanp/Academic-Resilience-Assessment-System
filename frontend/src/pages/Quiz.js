import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const allQuestions = [
    { id: 1, text: "I would not accept the tutors' feedback." },
    { id: 2, text: "I would use the feedback to improve my work." },
    { id: 3, text: "I would just give up." },
    { id: 4, text: "I would use the situation to motivate myself." },
    { id: 5, text: "I would change my career plans." },
    { id: 6, text: "I would probably get annoyed." },
    { id: 7, text: "I would begin to think my chances of success at university were poor." },
    { id: 8, text: "I would see the situation as a challenge." },
    { id: 9, text: "I would do my best to stop thinking negative thoughts." },
    { id: 10, text: "I would see the situation as temporary." },
    { id: 11, text: "I would work harder." },
    { id: 12, text: "I would probably get depressed." },
    { id: 13, text: "I would try to think of new solutions." },
    { id: 14, text: "I would be very disappointed." },
    { id: 15, text: "I would blame the tutor." },
    { id: 16, text: "I would keep trying." },
    { id: 17, text: "I would not change my long-term goals and ambitions." },
    { id: 18, text: "I would use my past successes to help motivate myself." },
    { id: 19, text: "I would begin to think my chances of getting the job I want were poor." },
    { id: 20, text: "I would start to monitor and evaluate my achievements and effort." },
    { id: 21, text: "I would seek help from my tutors." },
    { id: 22, text: "I would give myself encouragement." },
    { id: 23, text: "I would stop myself from panicking." },
    { id: 24, text: "I would try different ways to study." },
    { id: 25, text: "I would set my own goals for achievement." },
    { id: 26, text: "I would seek encouragement from my family and friends." },
    { id: 27, text: "I would try to think more about my strengths and weaknesses to help me work better." },
    { id: 28, text: "I would feel like everything was ruined and was going wrong." },
    { id: 29, text: "I would start to self-impose rewards and punishments depending on my performance." },
    { id: 30, text: "I would look forward to showing that I can improve my grades." }
];

export default function Quiz() {
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const shuffleQuestions = () => {
            let array = [...allQuestions];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            setShuffledQuestions(array);
        };
        shuffleQuestions();
    }, []);

    // Function to go Forward
    const handleNext = (val) => {
        const updatedAnswers = [...answers, { qId: shuffledQuestions[index].id, val }];
        setAnswers(updatedAnswers);
        
        if (index < shuffledQuestions.length - 1) {
            setIndex(index + 1);
        } else {
            setIsFinished(true);
        }
    };

    // NEW: Function to go Backward
    const handleBack = () => {
        if (index > 0) {
            setIndex(index - 1);
            // Remove the last answer from the list
            setAnswers(answers.slice(0, -1));
        }
    };

    const submitResults = async () => {
        const userId = localStorage.getItem('userId');
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/assessment/submit', {
                userId,
                answers
            });
            navigate('/student-dashboard'); 
        } catch (err) {
            console.error("Submission error", err);
            alert("Error: Could not connect to the server.");
            setSubmitting(false);
        }
    };

    if (shuffledQuestions.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="spinner-grow text-primary" role="status"></div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="card shadow-lg p-5 text-center border-0 rounded-4" style={{ maxWidth: '600px' }}>
                    <div className="mb-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="fw-bold mb-3 text-dark">Assessment Complete!</h2>
                    <p className="text-muted mb-5">Click below to submit your answers. You can also go back to review your choices.</p>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary btn-lg flex-fill rounded-pill fw-bold" onClick={() => { setIsFinished(false); handleBack(); }}>
                            Back to Review
                        </button>
                        <button 
                            className="btn btn-primary btn-lg flex-fill shadow fw-bold rounded-pill" 
                            onClick={submitResults}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Results'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light pb-5">
            {/* STICKY PROGRESS BAR */}
            <div className="sticky-top bg-white py-3 shadow-sm border-bottom mb-5">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-uppercase text-muted">Progress Bar</span>
                        <span className="small fw-bold text-primary">{index + 1} of 30</span>
                    </div>
                    <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                        <div 
                            className="progress-bar" 
                            style={{ 
                                width: `${((index + 1) / 30) * 100}%`, 
                                background: '#4f46e5', 
                                transition: 'width 0.4s ease' 
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="container mt-4" style={{ maxWidth: '800px' }}>
                {index === 0 && (
                    <div className="card border-0 shadow-sm text-white mb-4" style={{ background: '#4f46e5', borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <h6 className="fw-bold"><i className="bi bi-lightbulb me-2"></i> Imagine this Situation:</h6>
                            <p className="m-0 small opacity-90">
                                You just failed a major assignment and your tutor says you lack understanding. You are worried about your career. How would you react?
                            </p>
                        </div>
                    </div>
                )}

                <div className="card p-5 border-0 shadow-sm text-center bg-white rounded-4 position-relative">
                    {/* PREVIOUS BUTTON (Top Left of Card) */}
                    {index > 0 && (
                        <button 
                            className="btn btn-link text-decoration-none text-muted position-absolute" 
                            style={{ top: '20px', left: '20px' }}
                            onClick={handleBack}
                        >
                            <i className="bi bi-arrow-left me-1"></i> Previous
                        </button>
                    )}

                    <p className="text-muted small mb-4 fw-bold text-uppercase ls-wide mt-2">Self-Reflection Item</p>
                    <h2 className="mb-5 px-md-4 fw-bold text-dark lh-base" style={{ minHeight: '120px' }}>
                        "{shuffledQuestions[index].text}"
                    </h2>
                    
                    <div className="row g-3">
                        {[1, 2, 3, 4, 5].map(num => (
                            <div key={num} className="col">
                                <button 
                                    onClick={() => handleNext(num)} 
                                    className="btn btn-outline-primary w-100 py-4 fs-3 fw-bold rounded-3"
                                    style={{ borderWidth: '2px', transition: 'all 0.2s' }}
                                >
                                    {num}
                                </button>
                                <div className="mt-2 text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                                    {num === 1 ? 'Very Unlikely' : num === 5 ? 'Very Likely' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="text-center mt-4">
                    <p className="text-muted small italic">Question {index + 1} / 30</p>
                </div>
            </div>
        </div>
    );
}