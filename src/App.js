import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MentorList from './pages/MentorList';
import MentorDetail from './pages/MentorDetail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/mentors" 
              element={
                <PrivateRoute>
                  <MentorList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/mentors/:id" 
              element={
                <PrivateRoute>
                  <MentorDetail />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
