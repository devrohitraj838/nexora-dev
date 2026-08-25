const API_URL = "https://nexora-dev.onrender.com/api/ai/insights";

export const fetchAiInsight = async (stats) => {
  const token = localStorage.getItem("token");
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stats),
  });

  const data = await response.json();
  if (!response.ok) throw new Error("Failed to fetch AI insight");
  
  // Note: Depending on whether your controller sends the object directly 
  // or wraps it, check if you need data or data.insight!
  return data; 
};