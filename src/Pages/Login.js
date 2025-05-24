import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real application, this would be an API call to your backend
      // For now, we'll simulate a successful login for demonstration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!formData.username || !formData.password) {
        throw new Error('Please enter both username and password');
      }

      // Mock user data based on role
      let userData;
      
      if (formData.role === 'student') {
        userData = {
          id: 'STU' + Math.floor(1000 + Math.random() * 9000),
          name: 'Student User',
          matricule: formData.username,
          role: 'student'
        };
      } else if (formData.role === 'lecturer') {
        userData = {
          id: 'LEC' + Math.floor(1000 + Math.random() * 9000),
          name: 'Lecturer User',
          staffId: formData.username,
          role: 'lecturer',
          courses: ['MATH101', 'CS202', 'ENG305']
        };
      } else if (formData.role === 'admin') {
        userData = {
          id: 'ADM' + Math.floor(1000 + Math.random() * 9000),
          name: 'Admin User',
          adminId: formData.username,
          role: 'admin'
        };
      }

      // Set the user in context and redirect
      login(userData);
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>School Attendance System</h2>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Login as:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">
              {formData.role === 'student' ? 'Matricule Number' : 
               formData.role === 'lecturer' ? 'Staff ID' : 'Admin ID'}:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={
                formData.role === 'student' ? 'Enter your matricule number' : 
                formData.role === 'lecturer' ? 'Enter your staff ID' : 'Enter your admin ID'
              }
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>Forgot your password? <a href="#reset">Reset it here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
