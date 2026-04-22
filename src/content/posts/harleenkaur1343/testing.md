---
title: "Testing"
date: 2026-04-21
description: "My first post using Astro Content Collections and GitHub as a CMS"
contributors: ["harleenkaur1343"]
tags: ["astro", "blog", "intro"]
draft: false
---

## Welcome

This is my first post. It's written in **markdown** and validated automatically by Astro's Content Collections.

## How This Works

When I uploaded this file to `src/content/posts/harleen-acog/hello-world.md`:

1. GitHub Action validated the path
2. Confirmed the folder matches my GitHub username
3. Built the site with `astro build`
4. Indexed it with Pagefind for search
5. Deployed automatically

## Writing in Markdown

You can use all standard markdown:

- **Bold text**
- _Italic text_
- `inline code`
- [Links](https://astro.build)

### Code blocks

```js
const greeting = "Hello, Astro!";
console.log(greeting);
```

### Blockquotes

> Astro ships zero JavaScript by default. 

That's it — just write and push.
