import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // UI State
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Handle GitHub Callback from URL ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const urlName = queryParams.get("name");
    const githubUsername = queryParams.get("githubUsername");
    const error = queryParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ 
        name: urlName || "Developer",
        githubUsername: githubUsername
      }));
      navigate("/dashboard");
    } else if (error) {
      alert("GitHub authentication failed. Please try again.");
    }
  }, [location, navigate]);

  // --- Trigger GitHub Redirect ---
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  // --- Handle Manual Form Submission ---
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    // Add your existing axios logic here for manual register/login!
    alert(`Testing manual ${isRegistering ? "Registration" : "Login"} for: ${email}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Hero Section */}
        <h1 style={{ color: "#f8fafc", margin: "0 0 10px 0", fontSize: "2rem" }}>
          Nexora Dev
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px", lineHeight: "1.5" }}>
          Track your full-stack projects, conquer your DSA goals, and grow with AI-driven insights.
        </p>

        {/* The Hero Button */}
        <button 
          onClick={handleGithubLogin}
          style={styles.githubBtn}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          {/* Simple SVG GitHub Icon */}
          <svg height="24" width="24" viewBox="0 0 16 16" fill="white" style={{ marginRight: "10px" }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          Continue with GitHub
        </button>

        {/* Toggle to Hidden Form */}
        <div style={{ marginTop: "20px" }}>
          {!showEmailForm ? (
            <button 
              onClick={() => setShowEmailForm(true)} 
              style={styles.toggleBtn}
            >
              Or continue with email
            </button>
          ) : (
            <form onSubmit={handleManualSubmit} style={styles.form}>
              <hr style={{ borderColor: "#334155", margin: "20px 0", width: "100%" }} />
              
              {isRegistering && (
                <input 
                  type="text" placeholder="Full Name" value={name} 
                  onChange={(e) => setName(e.target.value)} style={styles.input} required 
                />
              )}
              <input 
                type="email" placeholder="Email Address" value={email} 
                onChange={(e) => setEmail(e.target.value)} style={styles.input} required 
              />
              <input 
                type="password" placeholder="Password" value={password} 
                onChange={(e) => setPassword(e.target.value)} style={styles.input} required 
              />
              
              <button type="submit" style={styles.submitBtn}>
                {isRegistering ? "Create Account" : "Sign In"}
              </button>

              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "15px" }}>
                {isRegistering ? "Already have an account? " : "Need an account? "}
                <span 
                  onClick={() => setIsRegistering(!isRegistering)} 
                  style={{ color: "#60a5fa", cursor: "pointer" }}
                >
                  {isRegistering ? "Sign In" : "Register"}
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline styles for the clean dark layout
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    fontFamily: "system-ui, sans-serif"
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    border: "1px solid #334155"
  },
  githubBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2ea043", // GitHub green for high conversion
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.2s"
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "white",
    fontSize: "1rem",
    outline: "none"
  },
  submitBtn: {
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Login;