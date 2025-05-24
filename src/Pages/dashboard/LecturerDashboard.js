import React, { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import Attendance from '../../Components/attendance/Attendance';

export const LecturerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Mock data for demonstration
  const courseData = [
    { 
      id: 'MATH101_2025', // Add unique course ID
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
      id: 'CS202_2025', // Add unique course ID
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
      id: 'ENG305_2025', // Add unique course ID
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
    setShowMarkAttendance(true);
  };

  const handleCloseAttendance = () => {
    setShowMarkAttendance(false);
    setSelectedCourse(null);
  };

  const handleAttendanceSubmitted = (attendanceRecord) => {
    // Handle the submitted attendance data
    console.log('Attendance submitted:', attendanceRecord);
    
    // You can add additional logic here such as:
    // - Updating course statistics
    // - Sending notifications
    // - Updating local state
    // - Refreshing data from server
    
    // Optional: Show success message
    alert(`Attendance for ${attendanceRecord.courseCode} has been recorded successfully!`);
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
        // Use the comprehensive Attendance component
        <Attendance
          courseId={selectedCourse.id}
          courseName={selectedCourse.courseName}
          courseCode={selectedCourse.courseCode}
          onClose={handleCloseAttendance}
          onAttendanceSubmitted={handleAttendanceSubmitted}
        />
      )}
    </>
  );
};

export default LecturerDashboard;