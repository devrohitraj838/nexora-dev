import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import InsightCard from "../components/InsightCard";
import { getProjects } from "../services/projectService";
import { getTotalCommits, getRecentRepos } from "../services/githubService";
import { getDsaProblems, logDsaProblem } from "../services/dsaService"; // Import the new POST function

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("Developer");
  const [projectCount, setProjectCount] = useState(0);
  const [commitCount, setCommitCount] = useState(0);
  const [dsaCount, setDsaCount] = useState(0);
  const [recentRepos, setRecentRepos] = useState([]);
  
  // Modal State
  const [isDsaModalOpen, setIsDsaModalOpen] = useState(false);
  const [dsaFormData, setDsaFormData] = useState({
    title: "",
    platform: "LeetCode",
    difficulty: "Easy"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserName(user.name || "Developer");
    }

    const fetchDashboardData = async () => {
      try {
        const [projects, commits, repos, dsaProblems] = await Promise.all([
          getProjects(),
          getTotalCommits(),
          getRecentRepos(4),
          getDsaProblems()
        ]);
        
        setProjectCount(projects.length);
        setCommitCount(commits);
        setRecentRepos(repos);
        setDsaCount(dsaProblems.length);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Handle Form Inputs
  const handleDsaChange = (e) => {
    setDsaFormData({ ...dsaFormData, [e.target.name]: e.target.value });
  };

  // Submit the new problem
  const handleDsaSubmit = async (e) => {
    e.preventDefault();
    try {
      await logDsaProblem(dsaFormData);
      
      // Instantly tick the counter up by 1 without refreshing the page!
      setDsaCount(prevCount => prevCount + 1); 
      
      // Reset and close
      setDsaFormData({ title: "", platform: "LeetCode", difficulty: "Easy" });
      setIsDsaModalOpen(false);
    } catch (error) {
      console.error("Error logging DSA problem:", error);
      alert("Failed to log problem. Check console.");
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h1>👋 Welcome back, {userName}</h1>
            <p>Track your coding journey and grow with AI.</p>
          </div>
          
          <button 
            onClick={() => setIsDsaModalOpen(true)}
            style={{
              padding: "10px 20px",
              background: "#10b981", // A nice emerald green to stand out
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Log DSA
          </button>
        </div>

        {/* The Stats Grid */}
        <div className="stats-grid">
          <StatCard title="Coding Streak" value="0 Days" icon="🔥" />
          <StatCard title="GitHub Commits" value={commitCount} icon="💻" />
          
          <Link to="/projects" style={{ textDecoration: "none", color: "inherit" }}>
            <StatCard title="Projects" value={projectCount} icon="📁" />
          </Link>
          
          <StatCard title="DSA Solved" value={dsaCount} icon="🧩" />
        </div>

        <InsightCard />

        {/* Live GitHub Feed Section */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#f8fafc" }}>
            Live GitHub Feed
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {recentRepos.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>Loading repositories...</p>
            ) : (
              recentRepos.map((repo) => (
                <a 
                  key={repo.id} 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    background: "#1e293b", padding: "20px", borderRadius: "12px",
                    textDecoration: "none", color: "inherit", border: "1px solid #334155",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    transition: "transform 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div>
                    <h3 style={{ margin: "0 0 10px 0", color: "#60a5fa", fontSize: "1.2rem" }}>{repo.name}</h3>
                    <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: "0 0 15px 0" }}>
                      {repo.description || "No description provided."}
                    </p>
                  </div>
                  {repo.language && (
                    <span style={{ fontSize: "0.8rem", background: "#0f172a", padding: "4px 8px", borderRadius: "4px", width: "fit-content" }}>
                      {repo.language}
                    </span>
                  )}
                </a>
              ))
            )}
          </div>
        </div>

        {/* DSA Quick-Log Modal */}
        {isDsaModalOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
          }}>
            <div style={{
              background: "#1e293b", padding: "30px", borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)", width: "100%", maxWidth: "400px", position: "relative"
            }}>
              <button 
                onClick={() => setIsDsaModalOpen(false)}
                style={{ position: "absolute", top: "15px", right: "20px", background: "transparent", color: "#94a3b8", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>

              <h2 style={{ marginTop: 0, marginBottom: "20px", color: "white" }}>Log a Problem</h2>

              <form onSubmit={handleDsaSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input
                  type="text" name="title" placeholder="Problem Name (e.g., Two Sum)"
                  value={dsaFormData.title} onChange={handleDsaChange} required
                  style={inputStyle}
                />
                
                <select name="platform" value={dsaFormData.platform} onChange={handleDsaChange} style={inputStyle}>
                  <option value="LeetCode">LeetCode</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="Other">Other</option>
                </select>

                <select name="difficulty" value={dsaFormData.difficulty} onChange={handleDsaChange} style={inputStyle}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <button 
                  type="submit"
                  style={{
                    padding: "12px", background: "#10b981", color: "white",
                    border: "none", borderRadius: "6px", fontWeight: "bold",
                    fontSize: "1rem", cursor: "pointer", marginTop: "10px"
                  }}
                >
                  Save to Tracker
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Reusable styling for form inputs
const inputStyle = {
  padding: "12px", borderRadius: "6px", border: "1px solid #334155",
  background: "#0f172a", color: "white", fontSize: "1rem", outline: "none"
};

export default Dashboard;