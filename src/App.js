import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard, { AdminDashboard } from './Pages/dashboard/Dashboard';
import StudentDashboard from './Pages/dashboard/StudentDashboard';
import LecturerDashboard from './Pages/dashboard/LecturerDashboard';



// Create a context to manage authentication state and user role
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('attendanceUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('attendanceUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('attendanceUser');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route 
          path="/dashboard/*" 
          element={
            user ? (
              <Dashboard>
                {user.role === 'student' && <StudentDashboard />}
                {user.role === 'lecturer' && <LecturerDashboard />}
                {user.role === 'admin' && <AdminDashboard />}
              </Dashboard>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;