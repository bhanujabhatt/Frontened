import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State variables to capture user input
  const [fid, setFid] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // States for login and data fetching
  const [loginMessage, setLoginMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState('');
  const [points, setPoints] = useState('');

  // Login handler
  const handleLogin = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      const response = await axios.post('http://localhost:8000/login', {
        fid,
        department,
        email,
        fname,
        lname,
        password,
        title,
        username,
      });

      if (response.status === 200) {
        setLoginMessage('Login successful');
        // Fetch the courses after a successful login
        fetchCourses(fid);
      } else {
        setLoginMessage('Login failed');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response ? err.response.data : 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for the logged-in faculty
  const fetchCourses = async (fid) => {
    try {
      const response = await axios.get(`http://localhost:8000/course/getcourses/${fid}`);
      console.log('Fetched Courses:', response.data);  // Log the courses response for debugging
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Error fetching courses');
    }
  };

  // Fetch students for the selected course
  const fetchStudents = async (cid) => {
    try {
      const response = await axios.get(`http://localhost:8000/course/getstudents/${cid}`);
      console.log('Fetched Students:', response.data);  // Log the students response for debugging
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error fetching students');
    }
  };

  // Update grade and points for a student
  const updateGrade = async () => {
    if (!selectedStudent || !grade || !points) {
      alert("Please select a student and enter both grade and points.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/course/${selectedStudent.sid}`, {
        sid: selectedStudent.sid,
        cid: selectedCourseId,
        grade: grade,
        points: points,
      });

      if (response.status === 200) {
        alert('Grade updated successfully!');
        // Refresh student list after updating grade
        fetchStudents(selectedCourseId);
      } else {
        alert('Failed to update grade.');
      }
    } catch (err) {
      console.error('Error updating grade:', err);
      setError('Error updating grade');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Faculty Management System</h1>

        {/* Login Form */}
        <section className="form-section">
          <h2>Login</h2>

          {/* Faculty ID Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Faculty ID"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
            />
          </div>

          {/* First Name Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </div>

          {/* Last Name Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Title Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Department Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          {/* Username Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button onClick={handleLogin} disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Display Login Message */}
          {loginMessage && <p className="message">{loginMessage}</p>}

          {/* Display Error Message */}
          {error && <p className="error-message">{error}</p>}
        </section>

        {/* Courses List */}
        {courses.length > 0 && (
          <section className="courses-section">
            <h2>Courses</h2>
            <ul>
              {courses.map(course => (
                <li key={course.cId} onClick={() => { 
                    setSelectedCourseId(course.cId); 
                    fetchStudents(course.cId); 
                  }}>
                  {course.cname} ({course.ccode})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Students List */}
        {students.length > 0 && (
          <section className="students-section">
            <h2>Students in {courses.find(course => course.cId === selectedCourseId)?.cname}</h2>
            <ul>
              {students.map(studentData => (
                <li
                  key={studentData.student.id}
                  onClick={() => setSelectedStudent(studentData.student)}
                >
                  {studentData.student.sname} {studentData.student.lname}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Update Grade Section */}
        {selectedStudent && (
          <section className="update-grade-section">
            <h3>Update Grade for {selectedStudent.sname} {selectedStudent.lname}</h3>

            {/* Grade Input */}
            <div className="input-group">
              <input
                type="text"
                placeholder="Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>

            {/* Points Input */}
            <div className="input-group">
              <input
                type="number"
                placeholder="Points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>

            {/* Update Button */}
            <button onClick={updateGrade} className="submit-btn">
              Update Grade
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;





