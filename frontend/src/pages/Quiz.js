import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
    const [scenario, setScenario] = useState("");
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAIData = async () => {
            try {
                // Fetch scenario and 30 questions from AI
                const res = await axios.get('http://localhost:5000/api/scenario/generate');
                setScenario(res.data.scenario);
                setQuestions(res.data.questions);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch AI data");
                setLoading(false);
            }
        };
        fetchAIData();
    }, []);

    const handleNext = (val) => {
        const currentQ = questions[index];
        // Ensure reverse logic is preserved for the scoring
        let actualVal = val;
        if (currentQ.isReverse) {
            actualVal = 6 - val;
        }

        setAnswers([...answers, { 
            qId: currentQ.id, 
            val: actualVal, 
            category: currentQ.category 
        }]);

        if (index < questions.length - 1) setIndex(index + 1);
        else setIsFinished(true);
    };

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <h4 className="fw-bold">Gemini AI is generating a custom 30-item assessment...</h4>
            <p className="text-muted text-center px-4">This takes about 10 seconds to create unique questions for you.</p>
        </div>
    );

    if (isFinished) return (
        <div className="container mt-5 text-center p-5 bg-white shadow rounded-4">
            <h2 className="text-success fw-bold">Assessment Generated!</h2>
            <p className="lead">AI has processed your customized responses.</p>
            <button className="btn btn-primary btn-lg px-5 shadow mt-4" onClick={async () => {
                await axios.post('http://localhost:5000/api/assessment/submit', { userId: localStorage.getItem('userId'), answers });
                navigate('/student-dashboard');
            }}>See My Resilience Report</button>
        </div>
    );

    return (
        <div className="min-vh-100 bg-light pb-5">
            <div className="sticky-top bg-white py-3 shadow-sm border-bottom">
                <div className="container" style={{ maxWidth: '850px' }}>
                    <div className="bg-dark text-white p-4 rounded-4 mb-3 shadow-sm">
                        <small className="fw-bold text-uppercase text-warning">Dynamic AI Context:</small>
                        <p className="m-0 fs-5 mt-1 lh-base">"{scenario}"</p>
                    </div>
                    <div className="d-flex justify-content-between small fw-bold text-muted mb-1">
                        <span>AI ASSESSMENT PROGRESS</span>
                        <span>{index + 1} / 30</span>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                        <div className="progress-bar bg-warning" style={{ width: `${((index + 1) / 30) * 100}%`, transition: '0.5s' }}></div>
                    </div>
                </div>
            </div>

            <div className="container mt-5" style={{ maxWidth: '850px' }}>
                <div className="card p-5 border-0 shadow-lg text-center rounded-4">
                    <h5 className="text-muted text-uppercase small mb-4 fw-bold">Based on this situation, how likely is this action?</h5>
                    <h2 className="mb-5 fw-bold text-dark lh-base" style={{ minHeight: '120px' }}>"{questions[index]?.text}"</h2>
                    
                    <div className="row g-3">
                        {[1, 2, 3, 4, 5].map(num => (
                            <div key={num} className="col">
                                <button onClick={() => handleNext(num)} className="btn btn-outline-warning w-100 py-4 fs-3 fw-bold rounded-4 border-2 shadow-sm hover-up">
                                    {num}
                                </button>
                                <div className="mt-2 small text-muted fw-bold">{num === 1 ? 'Never' : num === 5 ? 'Always' : ''}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-4 text-muted small italic">
                    Categories: {questions[index]?.category.toUpperCase()} | Item ID: {questions[index]?.id}
                </div>
            </div>
        </div>
    );
}