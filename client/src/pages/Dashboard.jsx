import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import InsightCard from "../components/InsightCard";

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="dashboard">

      <Navbar />

      <div className="dashboard-content">

        <h1>👋 Welcome back, Developer</h1>

        <p>
          Track your coding journey and grow with AI.
        </p>

        <div className="stats-grid">

          <StatCard
            title="Coding Streak"
            value="0 Days"
            icon="🔥"
          />

          <StatCard
            title="GitHub Commits"
            value="0"
            icon="💻"
          />

          <StatCard
            title="Projects"
            value="0"
            icon="📁"
          />

          <StatCard
            title="DSA Solved"
            value="0"
            icon="🧩"
          />

        </div>

        <InsightCard />

      </div>

    </div>
  );
}

export default Dashboard;