import React, { useState } from 'react';

const OnboardingModal = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    role: 'Student',
    year: '1st Year',
    goal: 'Internship'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In the next step, we will send this to your Node.js backend
    console.log("Onboarding Data Saved:", formData);
    
    // Close the modal
    onComplete(formData);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>Welcome to Nexora Dev 🚀</h2>
        <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '0.9rem' }}>
          Let's personalize your AI mentor before you start building.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Role Selection */}
          <div>
            <label style={styles.label}>Current Status</label>
            <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
              <option value="Student">Student</option>
              <option value="Developer">Working Professional</option>
              <option value="Self-Taught">Self-Taught Developer</option>
            </select>
          </div>

          {/* Year Selection */}
          <div>
            <label style={styles.label}>Academic Year / Experience</label>
            <select name="year" value={formData.year} onChange={handleChange} style={styles.select}>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduated">Graduated / Working</option>
            </select>
          </div>

          {/* Goal Selection */}
          <div>
            <label style={styles.label}>Primary Target</label>
            <select name="goal" value={formData.goal} onChange={handleChange} style={styles.select}>
              <option value="Internship">Securing an Internship</option>
              <option value="Placement">Campus Placements</option>
              <option value="Portfolio">Building a Portfolio</option>
              <option value="Open Source">Contributing to Open Source</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Save & Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple inline styles to keep it self-contained (you can move these to CSS later)
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px',
    width: '90%', maxWidth: '400px', border: '1px solid #334155',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
  },
  label: {
    display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '5px', fontWeight: 'bold'
  },
  select: {
    width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f172a',
    border: '1px solid #334155', color: '#f8fafc', fontSize: '1rem', outline: 'none'
  },
  button: {
    marginTop: '15px', padding: '12px', backgroundColor: '#3b82f6', color: 'white',
    border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'
  }
};

export default OnboardingModal;