const API_URL = "http://localhost:5000/api/projects";

// Get JWT token
const getToken = () => {
  return localStorage.getItem("token");
};

// Create Project
export const createProject = async (projectData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create project");
  
  return data;
};

// Get Projects
export const getProjects = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  // This is the most crucial line!
  if (!response.ok) throw new Error(data.message || "Failed to fetch projects");
  
  return data; // If it's an array, it returns the array safely
};

// Update Project
export const updateProject = async (id, projectData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update project");

  return data;
};

// Delete Project
export const deleteProject = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete project");

  return data;
};