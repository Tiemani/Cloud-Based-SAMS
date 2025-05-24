import React, { useState, useEffect } from 'react';

// Mock API function - replace with your actual API call
const fetchStudentsByCourse = async (courseId) => {
  // Mock data - replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockStudents = [
        { _id: '1', studentId: 'STU001', name: 'John Doe' },
        { _id: '2', studentId: 'STU002', name: 'Jane Smith' },
        { _id: '3', studentId: 'STU003', name: 'Mike Johnson' },
        { _id: '4', studentId: 'STU004', name: 'Sarah Wilson' },
        { _id: '5', studentId: 'STU005', name: 'David Brown' },
      ];
      resolve(mockStudents);
    }, 1000);
  });
};

const StudentSelect = ({ courseId, value, onChange, multiple = true }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      if (!courseId) {
        setStudents([]);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        const data = await fetchStudentsByCourse(courseId);
        setStudents(data);
      } catch (err) {
        setError('Failed to load students');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [courseId]);

  const filteredStudents = searchTerm
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    : students;

  const handleSelectChange = (studentId) => {
    if (multiple) {
      const currentValue = value || [];
      let newValue;
      
      if (currentValue.includes(studentId)) {
        newValue = currentValue.filter(id => id !== studentId);
      } else {
        newValue = [...currentValue, studentId];
      }
      
      onChange(newValue);
    } else {
      onChange(studentId);
      setIsDropdownOpen(false);
    }
  };

  const removeStudent = (studentId) => {
    if (multiple) {
      const currentValue = value || [];
      const newValue = currentValue.filter(id => id !== studentId);
      onChange(newValue);
    }
  };

  const getSelectedStudents = () => {
    if (!multiple) {
      return students.find(s => s._id === value);
    }
    return students.filter(s => value && value.includes(s._id));
  };

  if (!courseId) {
    return (
      <div className="form-group">
        <label>Student{multiple ? 's' : ''}</label>
        <div className="form-info">
          <i className="fas fa-info-circle"></i>
          Please select a course first
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="form-group">
        <label>Student{multiple ? 's' : ''}</label>
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          Loading students...
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>Student{multiple ? 's' : ''}</label>
      
      {error && (
        <div className="alert error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search search-icon"></i>
      </div>

      {/* Selected Students Display (Multiple) */}
      {multiple && value && value.length > 0 && (
        <div className="selected-students">
          {getSelectedStudents().map((student) => (
            <div key={student._id} className="student-chip">
              <span>{student.studentId} - {student.name}</span>
              <button
                type="button"
                className="chip-remove"
                onClick={() => removeStudent(student._id)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="select-dropdown">
        <button
          type="button"
          className="form-control dropdown-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {!multiple && value ? (
            (() => {
              const selected = getSelectedStudents();
              return selected ? `${selected.studentId} - ${selected.name}` : 'Select a student';
            })()
          ) : (
            `Select student${multiple ? 's' : ''}...`
          )}
          <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} dropdown-icon`}></i>
        </button>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            {!multiple && (
              <div
                className="dropdown-item"
                onClick={() => handleSelectChange('')}
              >
                <em>None</em>
              </div>
            )}
            
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className={`dropdown-item ${
                    multiple 
                      ? (value && value.includes(student._id) ? 'selected' : '')
                      : (value === student._id ? 'selected' : '')
                  }`}
                  onClick={() => handleSelectChange(student._id)}
                >
                  {multiple && (
                    <input
                      type="checkbox"
                      checked={value && value.includes(student._id)}
                      onChange={() => {}} // Handled by onClick
                      className="checkbox"
                    />
                  )}
                  <span>{student.studentId} - {student.name}</span>
                  {multiple && value && value.includes(student._id) && (
                    <i className="fas fa-check check-icon"></i>
                  )}
                </div>
              ))
            ) : (
              <div className="dropdown-item disabled">
                {searchTerm ? 'No students match your search' : 'No students found'}
              </div>
            )}
          </div>
        )}
      </div>

      {students.length === 0 && !loading && (
        <div className="form-info">
          <i className="fas fa-info-circle"></i>
          No students found for this course
        </div>
      )}
    </div>
  );
};

export default StudentSelect;