// src/services/githubService.js

const GITHUB_USERNAME = "devrohitraj838"; 

export const getTotalCommits = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}`,
      {
        headers: {
          "Accept": "application/vnd.github.cloak-preview" 
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub commits");
    }

    const data = await response.json();
    return data.total_count; 
  } catch (error) {
    console.error("GitHub API Error:", error);
    return 0; 
  }
};

// ADD THIS NEW FUNCTION BELOW
export const getRecentRepos = async (limit = 4) => {
  try {
    // Sort by 'updated' so your most active repos stay at the top
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repos");
    }

    return await response.json();
  } catch (error) {
    console.error("GitHub API Error:", error);
    return []; // Return empty array so the UI doesn't crash
  }
};