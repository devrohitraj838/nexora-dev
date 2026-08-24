const API_URL = "https://nexora-dev.onrender.com/api/ai/insight";

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
  
  return data.insight;
};