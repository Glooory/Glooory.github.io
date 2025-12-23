import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("should return empty string if date is empty string", () => {
    expect(formatDate("")).toBe("");
  });

  it("should format string date with default format", () => {
    const date = "2023-10-05";
    expect(formatDate(date)).toBe("2023/10/05");
  });

  it("should format Date object with default format", () => {
    const date = new Date("2023-10-05T00:00:00.000Z");
    expect(formatDate(date)).toMatch(/2023\/10\/05/);
  });

  it("should format with YYYY-MM-DD", () => {
    const date = "2023/01/01";
    expect(formatDate(date, "YYYY-MM-DD")).toBe("2023-01-01");
  });

  it("should format with YYYY/MM/DD HH:mm:ss", () => {
    const date = "2023-01-01 12:30:45";
    expect(formatDate(date, "YYYY/MM/DD HH:mm:ss")).toBe("2023/01/01 12:30:45");
  });

  it("should format with YYYY年MM月DD日", () => {
    const date = "2023-01-01";
    expect(formatDate(date, "YYYY年MM月DD日")).toBe("2023年01月01日");
  });

  it("should handle invalid date gracefully (dayjs behavior)", () => {
    expect(formatDate("invalid-date")).toBe("Invalid Date");
  });
});
