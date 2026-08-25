import React from 'react';

function InsightCard({ insight }) {
  // 1. Safety check: Handle loading state when insight hasn't arrived yet
  if (!insight) {
    return (
      <div style={cardStyle}>
        <p style={{ color: "#cbd5e1", margin: 0 }}>🤖 AI Mentor is analyzing your progress...</p>
      </div>
    );
  }

  // 2. Fallback just in case the API ever returns a plain string by accident
  if (typeof insight === 'string') {
    return (
      <div style={cardStyle}>
        <p style={{ color: "#cbd5e1", margin: 0 }}>{insight}</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ margin: "0 0 20px 0", color: "#f8fafc", fontSize: "1.5rem" }}>
        🧠 AI Action Hub
      </h2>
      
      <div style={gridStyle}>
        <div style={actionBlockStyle}>
          <h3 style={headerStyle}>🎯 Today's Focus</h3>
          <p style={textStyle}>{insight.focus}</p>
        </div>

        <div style={actionBlockStyle}>
          <h3 style={headerStyle}>🧩 DSA Strategy</h3>
          <p style={textStyle}>{insight.dsaAdvice}</p>
        </div>

        <div style={actionBlockStyle}>
          <h3 style={headerStyle}>💻 Project Next Steps</h3>
          <p style={textStyle}>{insight.projectAdvice}</p>
        </div>
      </div>
    </div>
  );
}

// Quick inline styles for the new layout (Feel free to move these to a CSS file!)
const cardStyle = {
  background: "#1e293b", padding: "25px", borderRadius: "12px", 
  marginTop: "30px", border: "1px solid #334155"
};

const gridStyle = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px"
};

const actionBlockStyle = {
  background: "#0f172a", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #60a5fa"
};

const headerStyle = {
  margin: "0 0 10px 0", color: "#60a5fa", fontSize: "1.1rem"
};

const textStyle = {
  color: "#cbd5e1", margin: 0, fontSize: "0.95rem", lineHeight: "1.5"
};

export default InsightCard;