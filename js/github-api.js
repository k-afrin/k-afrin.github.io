// TODO: replace with your actual GitHub username
const GITHUB_USERNAME = "yourusername";

async function loadGitHubRepos(containerId, options = {}) {
  const { limit = 6, excludeForks = true } = options;
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p class="loading-text">Loading repositories from GitHub…</p>';

  try {
    const res = await fetch(
      `https://api.github.com/users/&#36;{GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );
    if (!res.ok) throw new Error(`GitHub API error: &#36;{res.status}`);

    let repos = await res.json();
    if (excludeForks) repos = repos.filter((r) => !r.fork);
    repos = repos
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, limit);

    if (repos.length === 0) {
      container.innerHTML = "<p>No public repositories found.</p>";
      return;
    }

    container.innerHTML = repos
      .map(
        (repo) => `
      <article class="repo-card">
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
        <p>${repo.description ? repo.description : "No description provided."}</p>
        <div class="repo-meta">
          ${repo.language ? `<span class="tag">&#36;{repo.language}</span>` : ""}
          <span class="repo-stat">★ ${repo.stargazers_count}</span>
          <span class="repo-stat">⑂ ${repo.forks_count}</span>
        </div>
      </article>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="error-text">Couldn't load repositories right now (GitHub API rate limit or network issue).
      <a href="https://github.com/&#36;{GITHUB_USERNAME}" target="_blank" rel="noopener">View GitHub profile directly →</a></p>`;
  }
}
