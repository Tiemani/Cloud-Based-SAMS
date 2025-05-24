import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';
// Removed Dashboard.css import since styles are now in index.css

const Dashboard = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const renderSidebar = () => {
    let menuItems = [];
    
    // Common menu items
    menuItems.push(
      <li key="dashboard">
        <a href="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <i className="fas fa-home"></i> Dashboard
        </a>
      </li>
    );
    
    // Role-specific menu items
    if (user.role === 'student') {
      menuItems.push(
        <li key="attendance">
          <a href="/dashboard/my-attendance" className={location.pathname.includes('my-attendance') ? 'active' : ''}>
            <i className="fas fa-calendar-check"></i> My Attendance
          </a>
        </li>
      );
    } else if (user.role === 'lecturer') {
      menuItems.push(
        <li key="courses">
          <a href="/dashboard/courses" className={location.pathname.includes('courses') ? 'active' : ''}>
            <i className="fas fa-book"></i> My Courses
          </a>
        </li>,
        <li key="mark">
          <a href="/dashboard/mark-attendance" className={location.pathname.includes('mark-attendance') ? 'active' : ''}>
            <i className="fas fa-user-check"></i> Mark Attendance
          </a>
        </li>,
        <li key="reports">
          <a href="/dashboard/reports" className={location.pathname.includes('reports') ? 'active' : ''}>
            <i className="fas fa-chart-bar"></i> Attendance Reports
          </a>
        </li>
      );
    } else if (user.role === 'admin') {
      menuItems.push(
        <li key="students">
          <a href="/dashboard/students" className={location.pathname.includes('students') ? 'active' : ''}>
            <i className="fas fa-user-graduate"></i> Students
          </a>
        </li>,
        <li key="lecturers">
          <a href="/dashboard/lecturers" className={location.pathname.includes('lecturers') ? 'active' : ''}>
            <i className="fas fa-chalkboard-teacher"></i> Lecturers
          </a>
        </li>,
        <li key="courses">
          <a href="/dashboard/courses" className={location.pathname.includes('courses') ? 'active' : ''}>
            <i className="fas fa-book"></i> Courses
          </a>
        </li>,
        <li key="reports">
          <a href="/dashboard/reports" className={location.pathname.includes('reports') ? 'active' : ''}>
            <i className="fas fa-chart-bar"></i> Reports
          </a>
        </li>
      );
    }
    
    // Settings and logout for all users
    menuItems.push(
      <li key="settings">
        <a href="/dashboard/settings" className={location.pathname.includes('settings') ? 'active' : ''}>
          <i className="fas fa-cog"></i> Settings
        </a>
      </li>,
      <li key="logout">
        <button 
          onClick={(e) => { logout(); navigate('/login'); }}
          className="sidebar-button"
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </li>
    );
    
    return menuItems;
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Attendance System</h3>
          <p className="user-role">
            {user.role === 'student' && `Student: ${user.matricule}`}
            {user.role === 'lecturer' && `Lecturer: ${user.staffId}`}
            {user.role === 'admin' && `Admin: ${user.adminId}`}
          </p>
        </div>
        <ul className="sidebar-menu">
          {renderSidebar()}
        </ul>
      </div>
      
      <div className="main-content">
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

// AdminDashboard component - moved from the original file
export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Mock data for demonstration
  const statsData = {
    totalStudents: 1250,
    totalLecturers: 85,
    totalCourses: 45,
    avgAttendance: '87%'
  };
  
  return (
    <>
      <h1 className="page-title">Admin Dashboard</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Welcome, {user.name}</h3>
        </div>
        <div className="card-content">
          <p>Admin ID: {user.adminId}</p>
          <p>System Overview:</p>
        </div>
      </div>
      
      <div className="stats-container">
        <div className="card stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{statsData.totalStudents}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Lecturers</h3>
          <p className="stat-number">{statsData.totalLecturers}</p>
        </div>
        <div className="card stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{statsData.totalCourses}</p>
        </div>
        <div className="card stat-card">
          <h3>Avg Attendance</h3>
          <p className="stat-number">{statsData.avgAttendance}</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="management-buttons">
          <button className="btn btn-primary">Manage Students</button>
          <button className="btn btn-info">Manage Lecturers</button>
          <button className="btn btn-success">Generate Reports</button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;