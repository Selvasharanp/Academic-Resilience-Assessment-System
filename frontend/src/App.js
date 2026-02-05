import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Components and Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Quiz from './pages/Quiz';
import StudentDashboard from './pages/StudentDashboard';
import Welcome from './pages/Welcome'; // FIXED: Added this import

// Simplified ProtectedRoute - only checks if the user is logged in
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        {/* Protected Routes */}
                        <Route 
                            path="/welcome" 
                            element={
                                <ProtectedRoute>
                                    <Welcome />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/quiz" 
                            element={
                                <ProtectedRoute>
                                    <Quiz />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/student-dashboard" 
                            element={
                                <ProtectedRoute>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Default route redirects to login */}
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;