import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import { slug } from "github-slugger";

const blogPostsDir = "./content/blogs";
const workPostsDir = "./content/works";

const PostTypes = ["blog", "work"];

const [_, __, postType, ...rest] = process.argv;

if (!PostTypes.includes(postType)) {
  console.error("Error: ", "The third argument must be 'blog' or 'work'!");
  process.exit(1);
}

const postTitle = rest.join(" ").trim();
const postName = slug(postTitle).trim();

if (!postTitle || !postName) {
  console.error("Error: ", "The fourth argument(postName) is empty!");
  process.exit(1);
}

const dirName = postType === PostTypes[0] ? blogPostsDir : workPostsDir;
const fileName = `${slug(postName)}.md`;
const filePath = path.resolve(`${dirName}/${fileName}`);

const getPublishAt = () => dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

const getPostTemplate = (postTitle) => {
  return `---
title: "${postTitle}"
publishedAt: "${getPublishAt()}"
updatedAt: ""
tags: []
categories: []
---`;
};

if (fs.existsSync(filePath)) {
  console.error("Error: ", `${filePath} already exists!`);
  process.exit(1);
}

fs.writeFileSync(filePath, getPostTemplate(postTitle));

console.log(`Post Created: ${filePath}`);
