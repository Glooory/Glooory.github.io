import { describe, expect, it } from "vitest";
import { getHeadings } from "./post";

describe("getHeadings", () => {
  it("should extract h2 and h3 headings", async () => {
    const content = `
# Title
Intro
## Heading 1
Content 1
### Subheading 1.1
Content 1.1
## Heading 2
Content 2
    `;

    const headings = await getHeadings(content);

    expect(headings).toEqual([
      { text: "Heading 1", id: "heading-1", depth: 2 },
      { text: "Subheading 1.1", id: "subheading-11", depth: 3 },
      { text: "Heading 2", id: "heading-2", depth: 2 },
    ]);
  });

  it("should handle empty content", async () => {
    const headings = await getHeadings("");
    expect(headings).toEqual([]);
  });
});
