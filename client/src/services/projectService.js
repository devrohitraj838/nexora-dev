import axios from "axios";


const API_URL = "https://nexora-dev.onrender.com/api/projects"; 


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