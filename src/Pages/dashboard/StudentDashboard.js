import React, { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import QrScanner from 'react-qr-scanner';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  
  // Mock data for demonstration
  const attendanceData = [
    { courseCode: 'MATH101', courseName: 'Calculus I', totalPresent: 14, totalAbsent: 1, attendancePercentage: '93%' },
    { courseCode: 'CS202', courseName: 'Data Structures', totalPresent: 12, totalAbsent: 3, attendancePercentage: '80%' },
    { courseCode: 'ENG305', courseName: 'Technical Writing', totalPresent: 15, totalAbsent: 0, attendancePercentage: '100%' }
  ];

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

      {/* QR Scanner Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">QR Code Scanner</h3>
        </div>
        <div className="card-content">
          <button 
            onClick={() => setShowScanner(!showScanner)}
            className="btn btn-primary"
          >
            <i className="fas fa-qrcode"></i> {showScanner ? 'Close Scanner' : 'Scan QR Code'}
          </button>
        </div>
      </div>

      {/* QR Scanner for students */}
      {showScanner && (
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

export default StudentDashboard;