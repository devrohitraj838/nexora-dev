import { useEffect, useState } from "react";
import { getProjects, createProject } from "../services/projectService";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the popup
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Completed",
    techStack: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
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

      setProjects([...projects, newlyCreatedProject]);

      // Reset form and close modal on success
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
    <div style={{ padding: "40px 20px", color: "white", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.5rem", margin: 0 }}>My Projects</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Add Project
          </button>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            {/* Modal Content */}
            <div style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              width: "100%",
              maxWidth: "500px",
              position: "relative"
            }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "20px",
                  background: "transparent",
                  color: "#94a3b8",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer"
                }}
              >
                &times;
              </button>

              <h2 style={{ marginTop: 0, marginBottom: "20px" }}>New Project</h2>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input
                  type="text"
                  name="title"
                  placeholder="Project title (e.g., Expense Tracker)"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
                <textarea
                  name="description"
                  placeholder="Project description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                />
                <input
                  type="text"
                  name="techStack"
                  placeholder="Tech Stack (e.g., HTML, CSS, JavaScript)"
                  value={formData.techStack}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button 
                  type="submit"
                  style={{
                    padding: "12px",
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Save Project
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Projects Display Grid */}
        <div style={{ display: "grid", gap: "20px" }}>
          {projects.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>No projects found. Click above to add one!</p>
          ) : (
            projects.map((project) => (
              <div 
                key={project._id}
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "12px",
                  borderLeft: "5px solid #3b82f6"
                }}
              >
                <h2 style={{ margin: "0 0 10px 0", color: "#f8fafc" }}>{project.title}</h2>
                <p style={{ color: "#cbd5e1", marginBottom: "15px" }}>{project.description}</p>
                <div style={{ display: "flex", gap: "15px", fontSize: "0.9rem" }}>
                  <span style={{ background: "#0f172a", padding: "5px 10px", borderRadius: "4px" }}>
                    <strong>Status:</strong> {project.status}
                  </span>
                  {project.techStack && project.techStack.length > 0 && (
                    <span style={{ background: "#0f172a", padding: "5px 10px", borderRadius: "4px" }}>
                      <strong>Tech:</strong> {project.techStack.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  fontSize: "1rem",
  outline: "none"
};

export default Projects;