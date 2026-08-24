import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Statcard from "../components/Statcard";
import InsightCard from "../components/InsightCard";
import { getProjects } from "../services/projectService";
import { getTotalCommits, getRecentRepos } from "../services/githubService";
import { getDsaProblems, logDsaProblem } from "../services/dsaService";
import { fetchAiInsight } from "../services/aiService";

import "../styles/dashboard.css";

// --- STREAK CALCULATOR LOGIC ---
const calculateStreak = (projects, dsaProblems) => {
  const allDates = [
    ...projects.map(p => new Date(p.createdAt).toDateString()),
    ...dsaProblems.map(d => new Date(d.createdAt).toDateString())
  ];

  const uniqueDates = [...new Set(allDates)]
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => b - a);

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(uniqueDates[0]);
  lastActivity.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today - lastActivity);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays > 1) return 0;

  let checkDate = new Date(lastActivity);
  for (let i = 0; i < uniqueDates.length; i++) {
    const loopDate = new Date(uniqueDates[i]);
    loopDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === loopDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break; 
    }
  }

  return streak;
};

// --- MAIN DASHBOARD COMPONENT ---
function Dashboard() {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("Developer");
  const [projectCount, setProjectCount] = useState(0);
  const [commitCount, setCommitCount] = useState(0);
  
  const [dsaCount, setDsaCount] = useState(0);
  const [dsaList, setDsaList] = useState([]); 
  
  const [recentRepos, setRecentRepos] = useState([]);
  const [aiInsight, setAiInsight] = useState("Analyzing your developer metrics...");
  const [streakCount, setStreakCount] = useState(0);
  
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

    // Inside Dashboard.jsx inside the useEffect
    const userString = localStorage.getItem("user");
let githubUsernameToFetch = null; // Start with nothing

if (userString) {
  const user = JSON.parse(userString);
  setUserName(user.name || "Developer");
  
  if (user.githubUsername) {
     githubUsernameToFetch = user.githubUsername;
  }
}

    const fetchDashboardData = async () => {
  try {
    
    const projects = await getProjects();
    const dsaProblems = await getDsaProblems();
    
    // 2. Fetch GitHub data ONLY if they linked a GitHub account
    let commits = 0;
    let repos = [];
    
    if (githubUsernameToFetch) {
       commits = await getTotalCommits(githubUsernameToFetch);
       repos = await getRecentRepos(githubUsernameToFetch, 4);
    }

    // 3. Update the state (this stays exactly the same as your code)
    setProjectCount(projects.length);
    setCommitCount(commits);
    setRecentRepos(repos);
    setDsaCount(dsaProblems.length);
    setDsaList(dsaProblems);

    const currentStreak = calculateStreak(projects, dsaProblems);
    setStreakCount(currentStreak);

    // Fetch dynamic AI insight based on rich context
    const insight = await fetchAiInsight({
      userName: userName,
      commitsCount: commits,
      projectsCount: projects.length,
      dsaCount: dsaProblems.length,
      latestProject: projects.length > 0 ? projects[0].title : "None yet",
      latestDsa: dsaProblems.length > 0 ? `${dsaProblems[0].title} (${dsaProblems[0].difficulty})` : "None yet",
      latestRepo: repos.length > 0 ? repos[0].name : "None yet"
    });
            
    setAiInsight(insight);
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
  }
};

        // Fetch dynamic AI insight based on rich context
const insight = await fetchAiInsight({
  userName: userName,
  commitsCount: commits,
  projectsCount: projects.length,
  dsaCount: dsaProblems.length,
  latestProject: projects.length > 0 ? projects[0].title : "None yet",
  latestDsa: dsaProblems.length > 0 ? `${dsaProblems[0].title} (${dsaProblems[0].difficulty})` : "None yet",
  latestRepo: repos.length > 0 ? repos[0].name : "None yet"
});
        
        setAiInsight(insight);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleDsaChange = (e) => {
    setDsaFormData({ ...dsaFormData, [e.target.name]: e.target.value });
  };

  const handleDsaSubmit = async (e) => {
    e.preventDefault();
    try {
      await logDsaProblem(dsaFormData);
      
      const [projects, updatedDsaProblems] = await Promise.all([
        getProjects(),
        getDsaProblems()
      ]);
      
      setDsaList(updatedDsaProblems);
      setDsaCount(updatedDsaProblems.length);
      setStreakCount(calculateStreak(projects, updatedDsaProblems));
      
      setDsaFormData({ title: "", platform: "LeetCode", difficulty: "Easy" });
      // We removed setIsDsaModalOpen(false) here so the user can see their added problem immediately in the list!
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
        </div>

        {/* The Stats Grid */}
        <div className="stats-grid">
          <Statcard title="Coding Streak" value={`${streakCount} Days`} icon="🔥" />
          <Statcard title="GitHub Commits" value={commitCount} icon="💻" />
          
          {/* Projects Card - Now combines Manual + GitHub Projects! */}
          <Link to="/projects" style={{ textDecoration: "none", color: "inherit" }}>
            <Statcard title="Projects" value={projectCount + recentRepos.length} icon="📁" />
          </Link>
          
          {/* Clickable DSA Card Wrapper */}
          <div 
            onClick={() => setIsDsaModalOpen(true)}
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            title="Click to manage DSA problems"
          >
            <Statcard title="DSA Solved" value={dsaCount} icon="🧩" />
          </div>
        </div>

        {/* AI Insight Component */}
        <InsightCard insight={aiInsight} />

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

        {/* --- REDESIGNED DSA TRACKER MODAL --- */}
        {isDsaModalOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
          }}>
            <div style={{
              background: "#1e293b", padding: "30px", borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)", width: "100%", maxWidth: "500px", 
              maxHeight: "90vh", display: "flex", flexDirection: "column", position: "relative"
            }}>
              <button 
                onClick={() => setIsDsaModalOpen(false)}
                style={{ position: "absolute", top: "15px", right: "20px", background: "transparent", color: "#94a3b8", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>

              <h2 style={{ marginTop: 0, marginBottom: "20px", color: "white" }}>DSA Tracker</h2>

              {/* Form to Add New */}
              <form onSubmit={handleDsaSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <input
                  type="text" name="title" placeholder="Problem Name (e.g., Two Sum)"
                  value={dsaFormData.title} onChange={handleDsaChange} required
                  style={inputStyle}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <select name="platform" value={dsaFormData.platform} onChange={handleDsaChange} style={{...inputStyle, flex: 1}}>
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="Other">Other</option>
                  </select>
                  <select name="difficulty" value={dsaFormData.difficulty} onChange={handleDsaChange} style={{...inputStyle, flex: 1}}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  style={{
                    padding: "12px", background: "#10b981", color: "white",
                    border: "none", borderRadius: "6px", fontWeight: "bold",
                    fontSize: "1rem", cursor: "pointer", marginTop: "5px"
                  }}
                >
                  Save to Tracker
                </button>
              </form>

              <div style={{ borderTop: "1px solid #334155", margin: "10px 0 20px 0" }}></div>

              {/* Scrollable List of Solved Problems */}
              <h3 style={{ color: "#f8fafc", fontSize: "1.1rem", margin: "0 0 10px 0" }}>Recently Solved</h3>
              <div style={{ overflowY: "auto", paddingRight: "5px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {dsaList.length === 0 ? (
                  <p style={{ color: "#94a3b8", margin: 0 }}>No problems logged yet.</p>
                ) : (
                  dsaList.map((dsa, index) => (
                    <div key={index} style={{
                      background: "#0f172a", padding: "12px 15px", borderRadius: "8px",
                      border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span style={{ color: "#10b981", fontWeight: "bold" }}>{dsa.title}</span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ fontSize: "0.75rem", background: "#1e293b", padding: "4px 8px", borderRadius: "4px", color: "#cbd5e1" }}>
                          {dsa.platform}
                        </span>
                        <span style={{ 
                          fontSize: "0.75rem", 
                          background: "#1e293b", 
                          padding: "4px 8px", 
                          borderRadius: "4px",
                          color: dsa.difficulty === 'Hard' ? '#ef4444' : dsa.difficulty === 'Medium' ? '#f59e0b' : '#10b981'
                        }}>
                          {dsa.difficulty}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
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