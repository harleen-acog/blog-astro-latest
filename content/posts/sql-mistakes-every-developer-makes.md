---
title: SQL Mistakes Every Developer Makes
slug: sql-mistakes-every-developer-makes
date: 2026-04-20T12:17:29.981Z
author: Alice
email: undefined
excerpt: SQL Mistakes Every Developer Makes (And How to Fix Them) SQL has been around since the 1970s. You'd think we'd have figured it out by now. Yet the same mistakes...
tags: [sql]
---
# SQL Mistakes Every Developer Makes (And How to Fix Them)

SQL has been around since the 1970s. You'd think we'd have figured it out by now. Yet the same mistakes keep showing up in codebases — from startups to large engineering teams.

Here are the ones I see most often, and how to actually fix them.

## 1. SELECT * in Production Code

It's fine for quick exploration. It's a disaster in production.

```sql
-- ❌ Bad
SELECT * FROM users;

-- ✅ Good
SELECT id, name, email FROM users;
```

`SELECT *` returns every column — including ones you don't need, large blobs, and columns added later by someone else. It bloats network transfer, breaks assumptions in your application code, and makes query plans harder to optimise.

Always name your columns explicitly.

---

## 2. Not Using Indexes (Or Using Too Many)

A table with 10 rows doesn't need indexes. A table with 10 million rows absolutely does.

```sql
-- If you query by email frequently, index it
CREATE INDEX idx_users_email ON users(email);
```

But indexes aren't free — every write has to update them. Over-indexing slows down inserts and updates. The rule of thumb:

- Index columns you **filter by** (`WHERE`)
- Index columns you **join on**
- Index columns you **sort by** frequently (`ORDER BY`)
- Don't index columns with very low cardinality (e.g. a boolean `is_active`)

Use `EXPLAIN` or `EXPLAIN ANALYZE` to see if your queries are actually using indexes.

---

## 3. N+1 Queries

This is the silent killer of application performance. It looks like this in code:

```typescript
const users = db.prepare("SELECT * FROM users").all();

for (const user of users) {
  // This fires a separate query for EVERY user
  const posts = db.prepare("SELECT * FROM posts WHERE author_id = ?").all(user.id);
}
```

If you have 500 users, that's **501 database queries** for what should be one.

Fix it with a JOIN:

```sql
SELECT users.id, users.name, posts.title
FROM users
LEFT JOIN posts ON posts.author_id = users.id;
```

Or use a WHERE IN if you've already fetched the users:

```sql
SELECT * FROM posts
WHERE author_id IN (1, 2, 3, 4, 5);
```

---