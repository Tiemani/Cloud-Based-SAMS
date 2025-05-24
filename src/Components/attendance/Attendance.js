import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';

const Attendance = ({ 
  courseId, 
  courseName, 
  courseCode, 
  onClose, 
  onAttendanceSubmitted 
}) => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, present, absent
  const [sessionInfo, setSessionInfo] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    sessionType: 'lecture', // lecture, lab, tutorial, exam
    duration: 60,
    location: ''
  });
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });

  // Simulate fetching students enrolled in the course
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Mock API call - in real implementation, this would fetch from your backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock student data - would come from existing system integration
        const mockStudents = [
          { 
            id: 1, 
            matricule: 'ST2021001', 
            name: 'John Doe', 
            email: 'john.doe@university.edu',
            previousAttendance: 85,
            totalSessions: 20,
            presentSessions: 17,
            profilePicture: null,
            phoneNumber: '+1234567890'
          },
          { 
            id: 2, 
            matricule: 'ST2021002', 
            name: 'Jane Smith', 
            email: 'jane.smith@university.edu',
            previousAttendance: 92,
            totalSessions: 20,
            presentSessions: 18,
            profilePicture: null,
            phoneNumber: '+1234567891'
          },
          { 
            id: 3, 
            matricule: 'ST2021003', 
            name: 'Bob Johnson', 
            email: 'bob.johnson@university.edu',
            previousAttendance: 78,
            totalSessions: 20,
            presentSessions: 15,
            profilePicture: null,
            phoneNumber: '+1234567892'
          },
          { 
            id: 4, 
            matricule: 'ST2021004', 
            name: 'Alice Brown', 
            email: 'alice.brown@university.edu',
            previousAttendance: 95,
            totalSessions: 20,
            presentSessions: 19,
            profilePicture: null,
            phoneNumber: '+1234567893'
          },
          { 
            id: 5, 
            matricule: 'ST2021005', 
            name: 'Charlie Wilson', 
            email: 'charlie.wilson@university.edu',
            previousAttendance: 65,
            totalSessions: 20,
            presentSessions: 13,
            profilePicture: null,
            phoneNumber: '+1234567894'
          },
          { 
            id: 6, 
            matricule: 'ST2021006', 
            name: 'Diana Davis', 
            email: 'diana.davis@university.edu',
            previousAttendance: 88,
            totalSessions: 20,
            presentSessions: 17,
            profilePicture: null,
            phoneNumber: '+1234567895'
          }
        ];

        setStudents(mockStudents);
        
        // Initialize attendance data - all students marked as absent by default
        const initialAttendance = {};
        mockStudents.forEach(student => {
          initialAttendance[student.id] = {
            status: 'absent',
            timestamp: null,
            notes: ''
          };
        });
        setAttendanceData(initialAttendance);
        
      } catch (error) {
        console.error('Error fetching students:', error);
        alert('Failed to load students. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchStudents();
    }
  }, [courseId]);

  // Update attendance statistics
  useEffect(() => {
    const total = students.length;
    const present = Object.values(attendanceData).filter(
      attendance => attendance.status === 'present'
    ).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    setAttendanceStats({ total, present, absent, percentage });
  }, [attendanceData, students]);

  const handleAttendanceChange = (studentId, status, notes = '') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        status,
        timestamp: status === 'present' ? new Date().toISOString() : null,
        notes
      }
    }));
  };

  const markAllPresent = () => {
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.id] = {
        status: 'present',
        timestamp: new Date().toISOString(),
        notes: attendanceData[student.id]?.notes || ''
      };
    });
    setAttendanceData(updatedAttendance);
  };

  const markAllAbsent = () => {
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.id] = {
        status: 'absent',
        timestamp: null,
        notes: attendanceData[student.id]?.notes || ''
      };
    });
    setAttendanceData(updatedAttendance);
  };

  const handleBulkAttendanceFromList = (matricules) => {
    // This function can be used to mark attendance from a pre-scanned list
    // or students who have already scanned their IDs at school entrance
    const updatedAttendance = { ...attendanceData };
    
    students.forEach(student => {
      if (matricules.includes(student.matricule)) {
        updatedAttendance[student.id] = {
          status: 'present',
          timestamp: new Date().toISOString(),
          notes: 'Auto-marked from school entrance scan'
        };
      }
    });
    
    setAttendanceData(updatedAttendance);
  };

  const handleSubmitAttendance = async () => {
    if (attendanceStats.total === 0) {
      alert('No students to mark attendance for.');
      return;
    }

    // Validation
    if (!sessionInfo.location.trim()) {
      alert('Please enter the session location.');
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare attendance data for submission
      const attendanceRecord = {
        courseId,
        courseCode,
        courseName,
        lecturerId: user.id,
        lecturerName: user.name,
        sessionInfo,
        attendanceData: students.map(student => ({
          studentId: student.id,
          matricule: student.matricule,
          studentName: student.name,
          status: attendanceData[student.id].status,
          timestamp: attendanceData[student.id].timestamp,
          notes: attendanceData[student.id].notes
        })),
        submittedAt: new Date().toISOString(),
        stats: attendanceStats
      };

      // Mock API call to submit attendance
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for students with low attendance and trigger notifications
      const studentsToNotify = students.filter(student => {
        const newPresentCount = student.presentSessions + 
          (attendanceData[student.id].status === 'present' ? 1 : 0);
        const newTotalSessions = student.totalSessions + 1;
        const newAttendancePercentage = (newPresentCount / newTotalSessions) * 100;
        
        // Threshold check - notify if attendance drops below 75%
        return newAttendancePercentage < 75;
      });

      if (studentsToNotify.length > 0) {
        // In real implementation, this would trigger notification service
        console.log('Students to notify about low attendance:', studentsToNotify);
      }

      alert(`Attendance submitted successfully!\nPresent: ${attendanceStats.present}/${attendanceStats.total} (${attendanceStats.percentage}%)`);
      
      // Callback to parent component
      if (onAttendanceSubmitted) {
        onAttendanceSubmitted(attendanceRecord);
      }

      // Close the attendance component
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    return attendanceData[student.id]?.status === filterStatus;
  });

  const getAttendanceStatusColor = (percentage) => {
    if (percentage >= 90) return '#4CAF50'; // Green
    if (percentage >= 75) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="loading-spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="attendance-title">
          <h2>Mark Attendance - {courseCode}</h2>
          <p>{courseName}</p>
        </div>
        <button onClick={onClose} className="close-button">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Session Information */}
      <div className="session-info-card">
        <h3>Session Information</h3>
        <div className="session-info-grid">
          <div className="info-field">
            <label>Date:</label>
            <input
              type="date"
              value={sessionInfo.date}
              onChange={(e) => setSessionInfo(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div className="info-field">
            <label>Time:</label>
            <input
              type="time"
              value={sessionInfo.time}
              onChange={(e) => setSessionInfo(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          <div className="info-field">
            <label>Session Type:</label>
            <select
              value={sessionInfo.sessionType}
              onChange={(e) => setSessionInfo(prev => ({ ...prev, sessionType: e.target.value }))}
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Laboratory</option>
              <option value="tutorial">Tutorial</option>
              <option value="exam">Examination</option>
            </select>
          </div>
          <div className="info-field">
            <label>Duration (minutes):</label>
            <input
              type="number"
              value={sessionInfo.duration}
              onChange={(e) => setSessionInfo(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              min="30"
              max="240"
            />
          </div>
          <div className="info-field full-width">
            <label>Location:</label>
            <input
              type="text"
              placeholder="e.g., Room 101, Lab A, Online"
              value={sessionInfo.location}
              onChange={(e) => setSessionInfo(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="attendance-stats">
        <div className="stat-item">
          <span className="stat-label">Total Students:</span>
          <span className="stat-value">{attendanceStats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Present:</span>
          <span className="stat-value present">{attendanceStats.present}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Absent:</span>
          <span className="stat-value absent">{attendanceStats.absent}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Attendance:</span>
          <span className="stat-value percentage">{attendanceStats.percentage}%</span>
        </div>
      </div>

      {/* Controls */}
      <div className="attendance-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search students by name or matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Students</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>
        </div>
        
        <div className="bulk-actions">
          <button onClick={markAllPresent} className="btn-bulk-present">
            <i className="fas fa-check-circle"></i> Mark All Present
          </button>
          <button onClick={markAllAbsent} className="btn-bulk-absent">
            <i className="fas fa-times-circle"></i> Mark All Absent
          </button>
          <button 
            onClick={() => handleBulkAttendanceFromList(['ST2021001', 'ST2021002', 'ST2021004'])}
            className="btn-bulk-scan"
            title="Mark attendance for students who scanned at entrance"
          >
            <i className="fas fa-qrcode"></i> From Entrance Scans
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="students-attendance-table">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Student Name</th>
              <th>Previous Attendance</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className={`student-row ${attendanceData[student.id]?.status}`}>
                <td className="matricule">{student.matricule}</td>
                <td className="student-name">
                  <div className="student-info">
                    <strong>{student.name}</strong>
                    <small>{student.email}</small>
                  </div>
                </td>
                <td className="previous-attendance">
                  <div className="attendance-indicator">
                    <span 
                      className="attendance-percentage"
                      style={{ color: getAttendanceStatusColor(student.previousAttendance) }}
                    >
                      {student.previousAttendance}%
                    </span>
                    <small>{student.presentSessions}/{student.totalSessions}</small>
                  </div>
                </td>
                <td className="current-status">
                  <span className={`status-badge ${attendanceData[student.id]?.status}`}>
                    {attendanceData[student.id]?.status === 'present' ? (
                      <>
                        <i className="fas fa-check"></i> Present
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times"></i> Absent
                      </>
                    )}
                  </span>
                </td>
                <td className="actions">
                  <button
                    onClick={() => handleAttendanceChange(
                      student.id, 
                      attendanceData[student.id]?.status === 'present' ? 'absent' : 'present'
                    )}
                    className={`btn-toggle ${attendanceData[student.id]?.status === 'present' ? 'mark-absent' : 'mark-present'}`}
                  >
                    {attendanceData[student.id]?.status === 'present' ? 'Mark Absent' : 'Mark Present'}
                  </button>
                </td>
                <td className="notes">
                  <input
                    type="text"
                    placeholder="Add notes..."
                    value={attendanceData[student.id]?.notes || ''}
                    onChange={(e) => handleAttendanceChange(
                      student.id,
                      attendanceData[student.id]?.status,
                      e.target.value
                    )}
                    className="notes-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="attendance-submit">
        <button
          onClick={handleSubmitAttendance}
          disabled={submitting || attendanceStats.total === 0}
          className="btn-submit-attendance"
        >
          {submitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Submitting...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> Submit Attendance ({attendanceStats.present}/{attendanceStats.total})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Attendance;