export type OrgRepo = {
  name: string
  description: string | null
  htmlUrl: string
  homepage: string
  stars: number
  language: string | null
}

type GithubRepoResponse = {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  language: string | null
  fork: boolean
  archived: boolean
}

export async function fetchOrgPublicRepos(org: string): Promise<OrgRepo[]> {
  const repos: OrgRepo[] = []
  let page = 1

  while (true) {
    const response = await fetch(
      `https://api.github.com/orgs/${encodeURIComponent(org)}/repos?type=public&per_page=100&sort=updated&page=${page}`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )

    if (!response.ok) {
      throw new Error(`GitHub API 请求失败: ${response.status}`)
    }

    const data = (await response.json()) as GithubRepoResponse[]

    for (const repo of data) {
      if (repo.fork || repo.archived) continue
      if (!repo.homepage || !repo.homepage.trim()) continue

      repos.push({
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage.trim(),
        stars: repo.stargazers_count,
        language: repo.language,
      })
    }

    if (data.length < 100) break
    page += 1
  }

  return repos.sort((a, b) => b.stars - a.stars)
}
