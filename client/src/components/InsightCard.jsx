// src/components/InsightCard.jsx

function InsightCard({ insight }) {
  return (
    <div style={{
      background: "#1e293b",
      padding: "25px",
      borderRadius: "12px",
      border: "1px solid #334155",
      marginTop: "30px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    }}>
      <h3 style={{ margin: "0 0 10px 0", color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}>
        🤖 Today's AI Insight
      </h3>
      <p style={{ color: "#cbd5e1", margin: 0, fontSize: "1rem", lineHeight: "1.5" }}>
        {insight || "Analyzing your developer metrics..."}
      </p>
    </div>
  );
}

export default InsightCard;