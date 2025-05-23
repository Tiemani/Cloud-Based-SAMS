import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
// Removed Dashboard.css import since styles are now in index.css

// Note: You'll need to install the react-qr-scanner package:
// npm install react-qr-scanner --save
import QrScanner from 'react-qr-scanner'; // You'll need to install this package

const Dashboard = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);
      // In a real application, you'd send this data to your API
      // to mark the student as present in the school
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update UI
        setScanResult({
          success: true,
          message: 'Attendance marked successfully!',
          timestamp: new Date().toLocaleString(),
          data: data
        });
        
        // Close scanner after successful scan
        setTimeout(() => {
          setShowScanner(false);
        }, 3000);
        
      } catch (error) {
        setScanError('Failed to record attendance. Please try again.');
      }
    }
  };

  const handleError = (err) => {
    setScanError(err.message || 'Error scanning QR code');
  };

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
        </li>,
        <li key="scan">
          <button 
            onClick={(e) => { setShowScanner(!showScanner); }}
            className="sidebar-button"
          >
            <i className="fas fa-qrcode"></i> Scan QR Code
          </button>
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
        {/* QR Scanner for students */}
        {user.role === 'student' && showScanner && (
          <div className="card">
            <div className="card-header flex-header">
              <h3 className="card-title">Scan QR Code</h3>
              <button 
                onClick={() => setShowScanner(false)}
                className="close-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="qr-scanner">
              <div className="qr-preview">
                <QrScanner
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '100%' }}
                />
              </div>
              
              {scanResult && scanResult.success && (
                <div className="scan-result success">
                  <p><i className="fas fa-check-circle"></i> {scanResult.message}</p>
                  <p>Time: {scanResult.timestamp}</p>
                </div>
              )}
              
              {scanError && (
                <div className="scan-result error">
                  <p><i className="fas fa-exclamation-circle"></i> {scanError}</p>
                </div>
              )}
              
              <div className="scan-instructions">
                Scan the QR code at the entrance to mark your arrival at school.
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

// This is a placeholder for the StudentDashboard component
export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Mock data for demonstration
  const attendanceData = [
    { courseCode: 'MATH101', courseName: 'Calculus I', totalPresent: 14, totalAbsent: 1, attendancePercentage: '93%' },
    { courseCode: 'CS202', courseName: 'Data Structures', totalPresent: 12, totalAbsent: 3, attendancePercentage: '80%' },
    { courseCode: 'ENG305', courseName: 'Technical Writing', totalPresent: 15, totalAbsent: 0, attendancePercentage: '100%' }
  ];
  
  return (
    <>
      <h1 className="page-title">Student Dashboard</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Welcome, {user.name}</h3>
        </div>
        <div className="card-content">
          <p>Matricule: {user.matricule}</p>
          <p>Here's your attendance summary:</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Attendance Summary</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.totalPresent}</td>
                  <td>{course.totalAbsent}</td>
                  <td>{course.attendancePercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Enhanced LecturerDashboard with attendance marking functionality
export const LecturerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  
  // Mock data for demonstration
  const courseData = [
    { 
      courseCode: 'MATH101', 
      courseName: 'Calculus I', 
      students: 35, 
      nextClass: '2025-05-22 10:00 AM',
      studentsList: [
        { id: 1, matricule: 'ST001', name: 'John Doe' },
        { id: 2, matricule: 'ST002', name: 'Jane Smith' },
        { id: 3, matricule: 'ST003', name: 'Bob Johnson' },
        { id: 4, matricule: 'ST004', name: 'Alice Brown' },
        { id: 5, matricule: 'ST005', name: 'Charlie Wilson' }
      ]
    },
    { 
      courseCode: 'CS202', 
      courseName: 'Data Structures', 
      students: 28, 
      nextClass: '2025-05-22 2:00 PM',
      studentsList: [
        { id: 6, matricule: 'ST006', name: 'David Lee' },
        { id: 7, matricule: 'ST007', name: 'Emma Davis' },
        { id: 8, matricule: 'ST008', name: 'Frank Miller' },
        { id: 9, matricule: 'ST009', name: 'Grace Taylor' }
      ]
    },
    { 
      courseCode: 'ENG305', 
      courseName: 'Technical Writing', 
      students: 42, 
      nextClass: '2025-05-23 11:30 AM',
      studentsList: [
        { id: 10, matricule: 'ST010', name: 'Henry Anderson' },
        { id: 11, matricule: 'ST011', name: 'Ivy Thomas' },
        { id: 12, matricule: 'ST012', name: 'Jack Martin' }
      ]
    }
  ];

  const handleMarkAttendance = (course) => {
    setSelectedCourse(course);
    setStudentsList(course.studentsList);
    setShowMarkAttendance(true);
    // Initialize attendance data for all students as absent
    const initialAttendance = {};
    course.studentsList.forEach(student => {
      initialAttendance[student.id] = false;
    });
    setAttendanceData(initialAttendance);
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const presentCount = Object.values(attendanceData).filter(Boolean).length;
      const totalCount = studentsList.length;
      
      alert(`Attendance marked successfully!\nPresent: ${presentCount}/${totalCount}\nCourse: ${selectedCourse.courseCode}`);
      
      // Reset state
      setShowMarkAttendance(false);
      setSelectedCourse(null);
      setStudentsList([]);
      setAttendanceData({});
    } catch (error) {
      alert('Failed to submit attendance. Please try again.');
    }
  };

  const markAllPresent = () => {
    const allPresent = {};
    studentsList.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendanceData(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    studentsList.forEach(student => {
      allAbsent[student.id] = false;
    });
    setAttendanceData(allAbsent);
  };
  
  return (
    <>
      <h1 className="page-title">Lecturer Dashboard</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Welcome, {user.name}</h3>
        </div>
        <div className="card-content">
          <p>Staff ID: {user.staffId}</p>
          <p>Here are your courses:</p>
        </div>
      </div>
      
      {!showMarkAttendance ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">My Courses</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Students</th>
                  <th>Next Class</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseData.map((course, index) => (
                  <tr key={index}>
                    <td>{course.courseCode}</td>
                    <td>{course.courseName}</td>
                    <td>{course.students}</td>
                    <td>{course.nextClass}</td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMarkAttendance(course)}
                      >
                        Mark Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header flex-header">
            <h3 className="card-title">Mark Attendance - {selectedCourse.courseCode}</h3>
            <button 
              onClick={() => setShowMarkAttendance(false)}
              className="close-button"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="attendance-controls">
            <button 
              onClick={markAllPresent}
              className="btn-mark-all-present"
            >
              Mark All Present
            </button>
            <button 
              onClick={markAllAbsent}
              className="btn-mark-all-absent"
            >
              Mark All Absent
            </button>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Matricule</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((student) => (
                  <tr key={student.id}>
                    <td>{student.matricule}</td>
                    <td>{student.name}</td>
                    <td>
                      <span className={`attendance-status ${attendanceData[student.id] ? 'present' : 'absent'}`}>
                        {attendanceData[student.id] ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleAttendanceChange(student.id, !attendanceData[student.id])}
                        className={`btn-toggle-attendance ${attendanceData[student.id] ? 'mark-absent' : 'mark-present'}`}
                      >
                        {attendanceData[student.id] ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="submit-attendance-container">
            <button 
              onClick={handleSubmitAttendance}
              className="btn btn-submit"
            >
              Submit Attendance
            </button>
          </div>
          
          <div className="attendance-summary">
            Present: {Object.values(attendanceData).filter(Boolean).length} / {studentsList.length}
          </div>
        </div>
      )}
    </>
  );
};

// Add AdminDashboard component to match the expected exports
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

// Default export
export default Dashboard;