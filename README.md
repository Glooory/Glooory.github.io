# Next.js SSG + MDX + Mantine Blog Template

A simple and clean blog template built with Next.js SSG, MDX, and Mantine. [Live Demo](https://glooory.github.io/nextjs-mdx-mantine-blog/)

## Getting Started

1. Fork or clone the repository.
2. Checkout the `template` branch:
   Switch to the `template` branch to start with a clean slate(no demo content).
   ```bash
   git checkout template
   ```
3. Configure your site: Update the settings in `app.config.mjs`(e.g., site name, description).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 to view it in the browser.
6. Build for production :
   ```bash
   npm run build
   ```

## Writing Content

### Create a New Post

Use the included scripts to generate new content files with the correct frontmatter.

- **New Blog Post**:
  ```bash
  npm run new "Your Post Title"
  ```
- **New Work Case**:
  ```bash
  npm run new:work "Your Project Name"
  ```

### Edit Content

All content files are located in the `content/` directory.

- **Blogs**: `content/blogs/`
- **Works**: `content/works/`
- **About Page**: `content/about.mdx`

## Project Structure

```text
.
├── content/              # Markdown/MDX source files
│   ├── blogs/            # Blog posts
│   ├── works/            # Portfolio/Work cases
│   └── about.mdx         # The "About Me" page
├── public/               # Static assets (images, favicon)
├── scripts/              # Automation scripts (content generators)
└── src/                  # Next.js source code
```
