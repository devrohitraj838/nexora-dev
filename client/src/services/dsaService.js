

const API_URL = "https://nexora-dev.onrender.com/api/dsa";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getDsaProblems = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch DSA problems");
  
  return data; 
};


export const logDsaProblem = async (problemData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(problemData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to log problem");
  
  return data;
};