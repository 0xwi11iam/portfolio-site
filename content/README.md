# Blog content

Posts are plain Markdown files rendered client-side with `marked` — **no build step**. Everything lives in `content/`.

## Folder structure

```
content/
├── posts.json               ← the index (one entry per post)
└── posts/
    ├── hello-world/
    │   └── index.md         ← the post's Markdown
    ├── my-first-writeup/
    │   └── index.md
    └── <any-new-slug>/
        └── index.md

assets/                      ← ALL post media lives here (site root)
├── screenshot.png
├── demo.mp4
└── payload.bin
```

## How to publish a post (3 steps)

### 1. Create the post folder + Markdown

Create `content/posts/<slug>/index.md`, e.g. `content/posts/my-post/index.md`.

The `<slug>` should be lowercase letters, numbers, and dashes — it becomes part of the post's URL (`/post.html?slug=my-post`).

### 2. Add assets (images, videos, attachments)

Drop any images, videos, or downloadable files **into the root `assets/` folder**, then reference them with **relative paths** — no leading `/`:

```markdown
![a screenshot](screenshot.png)

<video src="demo.mp4" controls></video>

[download the payload](payload.bin)
```

Rules for asset paths:

- **Relative paths** (like `screenshot.png`) automatically resolve to `assets/screenshot.png` at the site root when the post renders.
- Want to keep assets organized? Use subfolders under `assets/` and include the subfolder: `![x](writeups/foo.png)` → `assets/writeups/foo.png`.
- **Absolute paths** starting with `http://`, `https://`, `/`, `#`, `data:`, or `mailto:` are left untouched — use those for external images and links (e.g. `/assets/foo.png` also works).
- **Keep filenames unique** across the whole site (or use subfolders) — two posts sharing `screenshot.png` would point at the same file.
- Supported: any image type (`png`, `jpg`, `jpeg`, `webp`, `gif`, `svg`), `<video>`, `<audio>`, and plain links to any attachment file.

### 3. Register the post in `content/posts.json`

Add an entry **with the same slug as the folder**:

```json
{
  "slug": "my-post",
  "title": "My post title",
  "date": "2026-08-16",
  "author": "0xwi11iam",
  "excerpt": "One sentence shown on the blog index."
}
```

> ⚠️ **Watch the commas.** `posts.json` is a JSON array — every entry except the **last** must end with a comma (`,`). Missing commas are the #1 reason the blog silently fails to load.

## How it works

- `blog.html` fetches `posts.json`, sorts by `date` (newest first), and lists each post.
- `post.html?slug=<slug>` fetches `posts.json` for the metadata, then fetches `content/posts/<slug>/index.md` and renders the Markdown.
- The `slug` in `posts.json` must **exactly match** the folder name, or the post shows "not found".

## Editing an existing post

Edit `content/posts/<slug>/index.md` and push — the change goes live immediately, no rebuild needed.
