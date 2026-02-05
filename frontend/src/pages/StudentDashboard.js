import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Radar, Line, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, Title, BarElement
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, Title, BarElement);

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [latestResult, setLatestResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [globalStats, setGlobalStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [improvement, setImprovement] = useState(0);

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resHistory = await axios.get(`http://localhost:5000/api/assessment/user-history/${userId}`);
                const data = resHistory.data;
                setHistory(data);

                if (data.length > 0) {
                    setLatestResult(data[data.length - 1]);
                    if (data.length > 1) {
                        const last = data[data.length - 1].totalScore;
                        const prev = data[data.length - 2].totalScore;
                        setImprovement(((last - prev) / prev) * 100);
                    }
                }
                const resGlobal = await axios.get(`http://localhost:5000/api/assessment/global-stats`);
                setGlobalStats(resGlobal.data);
            } catch (err) { console.error("Error fetching dashboard data", err); }
        };
        fetchData();
    }, [userId]);

    const downloadPDF = () => {
        const input = document.getElementById('report-area');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.setFontSize(22);
            pdf.setTextColor(79, 70, 229);
            pdf.text("Psychological Resilience Report", 15, 20);
            pdf.setFontSize(12);
            pdf.setTextColor(100);
            pdf.text(`Student: ${userName} | Date: ${new Date().toLocaleDateString()}`, 15, 30);
            pdf.addImage(imgData, 'PNG', 10, 40, 190, 130);
            pdf.save(`${userName}_Resilience_Profile.pdf`);
        });
    };

    
    if (!latestResult) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center">
                <h2 className="fw-bold">Welcome, {userName}!</h2>
                <p className="text-muted">You haven't completed an assessment yet.</p>
                <button className="btn btn-primary btn-lg shadow mt-3" onClick={() => navigate('/quiz')}>Start Assessment</button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container pb-5">
            <div className="container pt-5">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <h6 className="text-primary fw-bold text-uppercase mb-2" style={{ letterSpacing: '2px' }}>Student Insights</h6>
                        <h2 className="fw-bold m-0 text-dark">Hello, {userName}!</h2>
                        <p className="text-muted m-0">Here is your academic resilience analysis based on your latest activity.</p>
                    </div>
                    <div className="d-flex gap-3">
                        <button className="btn btn-white bg-white border shadow-sm px-4 fw-bold" onClick={downloadPDF}>Export Report</button>
                        <button className="btn btn-primary px-4 fw-bold shadow" onClick={() => navigate('/quiz')}>Retake Assessment</button>
                    </div>
                </div>

                {/* KPI METRICS */}
                <div className="row g-4 mb-5">
                    {[
                        { title: 'Resilience Score', val: latestResult.totalScore, color: 'indigo', icon: 'bi-cpu', max: 150 },
                        { title: 'Perseverance', val: latestResult.perseverance, color: 'success', icon: 'bi-award', max: 70 },
                        { title: 'Help-Seeking', val: latestResult.helpSeeking, color: 'info', icon: 'bi-people', max: 45 },
                        { title: 'Emotional Regulation', val: latestResult.negativeAffect, color: 'warning', icon: 'bi-heart', max: 35 }
                    ].map((m, i) => (
                        <div className="col-md-3" key={i}>
                            <div className="metric-card shadow-sm h-100 border-bottom border-4 border-0" style={{ borderBottomColor: `var(--bs-${m.color})` }}>
                                <div className={`icon-box bg-${m.color} bg-opacity-10 text-${m.color}`}>
                                    <i className={`bi ${m.icon} fs-4`}></i>
                                </div>
                                <p className="text-muted small fw-bold text-uppercase mb-1">{m.title}</p>
                                <div className="d-flex align-items-baseline gap-2">
                                    <h2 className="fw-bold m-0">{m.val}</h2>
                                    <span className="text-muted small">/ {m.max}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <ul className="nav nav-pills mb-4 gap-2">
                    {['overview', 'benchmarks', 'history'].map((tab) => (
                        <li className="nav-item" key={tab}>
                            <button className={`nav-link text-capitalize ${activeTab === tab ? 'active' : 'bg-white shadow-sm'}`} onClick={() => setActiveTab(tab)}>
                                {tab} Analysis
                            </button>
                        </li>
                    ))}
                </ul>

                {/* CONTENT AREA */}
                <div id="report-area">
                    {activeTab === 'overview' && (
                        <div className="row g-4">
                            <div className="col-md-8">
                                <div className="chart-container shadow-sm h-100">
                                    <div className="d-flex justify-content-between mb-4">
                                        <h5 className="fw-bold">Resilience Balance (ARS-30)</h5>
                                        <span className={`fw-bold ${improvement >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {improvement >= 0 ? '↑' : '↓'} {Math.abs(improvement).toFixed(1)}% Growth
                                        </span>
                                    </div>
                                    <div style={{ height: '350px' }}>
                                        <Radar data={{
                                            labels: ['Perseverance', 'Help-Seeking', 'Emotional Regulation'],
                                            datasets: [{
                                                label: 'Profile',
                                                data: [latestResult.perseverance, latestResult.helpSeeking, latestResult.negativeAffect],
                                                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                                                borderColor: '#4f46e5',
                                                borderWidth: 3,
                                                pointBackgroundColor: '#4f46e5'
                                            }]
                                        }} options={{ maintainAspectRatio: false, scales: { r: { suggestedMax: 50, ticks: { display: false } } } }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-white h-100">
                                    <h5 className="fw-bold mb-4">Dimension Analysis</h5>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="fw-bold small">Persistence Strength</span>
                                            <span className="text-primary fw-bold">High</span>
                                        </div>
                                        <p className="text-muted small">Your ability to sustain focus on long-term goals is exceptional compared to early baselines.</p>
                                    </div>
                                    <div className="alert bg-indigo bg-opacity-10 text-primary border-0 rounded-4">
                                        <h6 className="fw-bold"><i className="bi bi-lightbulb me-2"></i>Smart Recommendation</h6>
                                        <p className="small m-0">Try practicing reflective help-seeking during difficult weeks to balance your internal perseverance with external support.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'benchmarks' && (
                        <div className="chart-container shadow-sm">
                            <h5 className="fw-bold mb-4">Peer Benchmarking</h5>
                            <div style={{ height: '400px' }}>
                                <Bar data={{
                                    labels: ['Perseverance', 'Help-Seeking', 'Emotional regulation'],
                                    datasets: [
                                        { label: 'You', data: [latestResult.perseverance, latestResult.helpSeeking, latestResult.negativeAffect], backgroundColor: '#4f46e5', borderRadius: 8 },
                                        { label: 'Peer Average', data: [globalStats?.avgPerseverance, globalStats?.avgHelpSeeking, globalStats?.avgNegativeAffect], backgroundColor: '#e2e8f0', borderRadius: 8 }
                                    ]
                                }} options={{ maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } } }} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="chart-container shadow-sm">
                            <h5 className="fw-bold mb-4">Progression Tracking</h5>
                            <div style={{ height: '400px' }}>
                                <Line data={{
                                    labels: history.map((_, i) => `Assmt ${i+1}`),
                                    datasets: [{ label: 'Overall Trend', data: history.map(h => h.totalScore), borderColor: '#4f46e5', tension: 0.4, fill: true, backgroundColor: 'rgba(79, 70, 229, 0.05)' }]
                                }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}