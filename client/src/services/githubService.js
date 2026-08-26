// src/services/githubService.js

export const getTotalCommits = async (username) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author:${username}`,
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

export const getRecentRepos = async (username, limit = 100) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repos");
    }

    return await response.json();
  } catch (error) {
    console.error("GitHub API Error:", error);
    return []; 
  }
};