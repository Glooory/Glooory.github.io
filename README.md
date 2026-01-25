# A "Next.js SSG + MDX + Mantine" Blog

It's very simple and clean. [preview](https://glooory.github.io/nextjs-mdx-mantine-blog/)

## Getting Started

1. Fork or clone the repo.
2. Change the configurations in `app.config.mjs`
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Build for production : `npm run build`

## Writing Content

1. Creating file

- **New Blog Post**: `npm run new {{blogName}}`.
- **New Work Case**: `npm run new:work {{pageName}}`.

2. Editing content
   Edit the files under `content` directory.

## Project Structure

```text
.
├── content/              # Markdown/MDX source files
│   ├── blogs/            # Blog posts go here
│   ├── works/            # Portfolio/Work cases go here
│   └── about.mdx         # The "About Me" page
├── public/               # Static assets (images, favicon)
├── scripts/              # Automation scripts (new post generators)
└── src/                  # Next.js Source code
```
