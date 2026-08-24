import axios from "axios";

// Point this to your backend Express server
const API_URL = "https://nexora-dev.onrender.com/api/projects"; 

// Helper function to grab your JWT token for secure requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getProjects = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData, getAuthHeaders());
  return response.data;
};