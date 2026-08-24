import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../styles/login.css"; 

function Login() {
  const navigate = useNavigate();
  
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 1. Forcefully scan the raw URL, bypassing React Router quirks
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const urlName = queryParams.get("name");
    const githubUsername = queryParams.get("githubUsername");
    const error = queryParams.get("error");

    // 2. If a token exists, save it and forcefully redirect!
    if (token) {
      setIsProcessing(true); // Show the user something is happening
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ 
        name: urlName || "Developer",
        githubUsername: githubUsername
      }));
      
      // Hard redirect to clear the URL and guarantee Dashboard loads
      window.location.href = "/dashboard";
    } else if (error) {
      alert("GitHub authentication failed. Please try again.");
      window.location.href = "/login"; // Clear the error from the URL
    }
  }, []);

  const handleGithubLogin = () => {
    setIsProcessing(true);
    window.location.href = "https://nexora-dev.onrender.com/api/auth/github"; 
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://nexora-dev.onrender.com/api/users/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify({ name: response.data.user.name }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth Error:", error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <h1 className="login-title">Nexora Dev</h1>
        <p className="login-subtitle">
          Track your full-stack projects, conquer your DSA goals, and grow with AI-driven insights.
        </p>

        <button onClick={handleGithubLogin} className="github-btn" disabled={isProcessing}>
          <svg height="24" width="24" viewBox="0 0 16 16" fill="white" style={{ marginRight: "10px" }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          {isProcessing ? "Logging in..." : "Continue with GitHub"}
        </button>

        <div>
          {!showEmailForm ? (
            <button onClick={() => setShowEmailForm(true)} className="toggle-btn" disabled={isProcessing}>
              Or sign in with email
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} className="login-form">
              <hr style={{ borderColor: "#334155", margin: "20px 0", width: "100%" }} />
              
              <input 
                type="email" placeholder="Email Address" value={email} 
                onChange={(e) => setEmail(e.target.value)} className="login-input" required 
                disabled={isProcessing}
              />
              <input 
                type="password" placeholder="Password" value={password} 
                onChange={(e) => setPassword(e.target.value)} className="login-input" required 
                disabled={isProcessing}
              />
              
              <button type="submit" className="submit-btn" disabled={isProcessing}>
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;