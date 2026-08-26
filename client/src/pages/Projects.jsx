import { useEffect, useState } from "react";
import { getProjects, createProject } from "../services/projectService";
import { getRecentRepos } from "../services/githubService";
import "../styles/projects.css"; 

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Completed",
    techStack: "",
  });

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const userString = localStorage.getItem("user");
        let githubUsername = "devrohitraj838"; // Fallback username
        
        if (userString) {
          const user = JSON.parse(userString);
          if (user.githubUsername) {
            githubUsername = user.githubUsername;
          }
        }

        const [manualProjects, githubRepos] = await Promise.all([
          getProjects(),
          getRecentRepos(githubUsername, 100) 
        ]);

        const formattedGithubRepos = githubRepos.map(repo => ({
          _id: repo.id, 
          title: repo.name,
          description: repo.description || "No description provided.",
          status: "GitHub Auto-Sync",
          techStack: repo.language ? [repo.language] : [],
          isGithub: true, 
          url: repo.html_url
        }));

        setProjects([...manualProjects, ...formattedGithubRepos]);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const projectPayload = {
        ...formData,
        techStack: formData.techStack 
          ? formData.techStack.split(",").map((tech) => tech.trim()) 
          : [],
      };

      const response = await createProject(projectPayload);
      const newlyCreatedProject = response.project ? response.project : response;

      setProjects([newlyCreatedProject, ...projects]);

      setFormData({
        title: "",
        description: "",
        status: "Planned",
        techStack: "",
      });
      setIsModalOpen(false); 
      
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Check the console for details.");
    }
  };

  return (
    <div className="projects-container">
      
      <div className="projects-header">
        <h1 className="projects-title">My Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          + Add Project
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="close-btn">
              &times;
            </button>

            <h2 style={{ marginTop: 0, marginBottom: "20px", color: "white" }}>New Project</h2>

            <form onSubmit={handleSubmit} className="project-form">
              <input
                type="text"
                name="title"
                placeholder="Project title (e.g., Expense Tracker)"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
              />
              <textarea
                name="description"
                placeholder="Project description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-input"
                style={{ minHeight: "100px", resize: "vertical" }}
              />
              <input
                type="text"
                name="techStack"
                placeholder="Tech Stack (e.g., HTML, CSS, React)"
                value={formData.techStack}
                onChange={handleChange}
                className="form-input"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              
              <button type="submit" className="submit-btn">
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>Loading projects...</p>
      ) : (
        <div className="projects-grid">
          {projects.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px", gridColumn: "1 / -1" }}>
              No projects found. Click above to add one!
            </p>
          ) : (
            projects.map((project) => (
              <div key={project._id} className={`project-card ${project.isGithub ? 'github-card' : ''}`}>
                
                <div className="card-header">
                  {project.isGithub ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="github-link">
                      {project.title} ↗
                    </a>
                  ) : (
                    <h2 className="card-title">{project.title}</h2>
                  )}
                  {project.isGithub && <span className="github-badge">GitHub</span>}
                </div>

                <p className="card-desc">{project.description}</p>
                
                <div className="tag-container">
                  <span className="status-tag">
                    <strong>Status:</strong> {project.status}
                  </span>
                  {project.techStack && project.techStack.length > 0 && (
                    <span className="tech-tag">
                      <strong>Tech:</strong> {project.techStack.join(", ")}
                    </span>
                  )}
                </div>
                
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Projects;