# blog-astro-latest

A GitHub-powered blog platform. No CMS, no database. Markdown files are the content.

---

## How It Works

```
Author uploads .md file → GitHub Action validates → auto deploys → post is live
```

---

## For Authors

### Your first post

1. Get added as a collaborator (repo owner invites you)
2. Clone the repo
3. Create a branch: `git checkout -b post/my-first-post`
4. Add your post: `src/content/posts/{your-github-username}/my-post.md`
5. Push and open a PR
6. GitHub Action validates and auto-merges if everything passes

### Frontmatter (required fields)

Every `.md` file must have this at the top:

```yaml
---
title: "Your Post Title"
date: 2026-04-21
description: "A short summary shown in previews"
tags: ["optional", "tags"]
draft: false
---

Your markdown content here...
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | shown on post page + cards |
| `date` | Yes | format: YYYY-MM-DD |
| `description` | Yes | shown in post previews |
| `tags` | No | array of strings |
| `draft` | No | set `true` to hide from site |

### Folder rules

```
✅ src/content/posts/{your-github-username}/post-name.md
❌ src/content/posts/post-name.md          (no username folder)
❌ src/content/posts/someone-else/post.md  (wrong folder)
```

Your folder name **must match your GitHub username exactly**.

---

## For Collaborators

To edit someone else's post:

1. Create a branch
2. Edit their file in `src/content/posts/{their-username}/`
3. Open a PR
4. They get automatically notified (CODEOWNERS)
5. They review and approve
6. Merge → live

---

## Admin Setup (One Time)

### 1. Add collaborators
```
GitHub repo → Settings → Collaborators → Add people
```

### 2. Branch protection on `main`
```
Settings → Branches → Add branch ruleset

✅ Require status checks: "Check Post Paths", "Build Site"
✅ Block force pushes
❌ No approval requirement (Action handles this)
```

### 3. Action write permissions
```
Settings → Actions → General → Workflow permissions
→ Read and write permissions ✅
```

### 4. Add deploy secret
```
Settings → Secrets → Actions → New repository secret
Name: VERCEL_TOKEN
Value: (your token from vercel.com/account/tokens)
```

---

## Routes

| URL | Page |
|---|---|
| `/` | Home — recent posts from all authors |
| `/authors` | All authors |
| `/{username}` | Author profile |
| `/{username}/blog` | All posts by author |
| `/{username}/blog/{slug}` | Individual post |

---

## Local Development

```bash
npm install
npm run dev      # dev server (search won't work in dev)
npm run build    # build + pagefind index
npm run preview  # preview built site (search works here)
```

---

## Tech Stack

- [Astro](https://astro.build) — static site framework
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — markdown + schema validation
- [Pagefind](https://pagefind.app) — full-text search, zero backend
- [GitHub Actions](https://github.com/features/actions) — CI/CD + validation
- Vercel — hosting
