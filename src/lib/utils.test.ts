import { expect, test, describe } from "bun:test";
import { cn } from "./utils";

describe("cn", () => {
  test("concatenates basic strings", () => {
    expect(cn("a", "b")).toBe("a b");
    expect(cn("btn", "primary")).toBe("btn primary");
  });

  test("handles conditional classes", () => {
    expect(cn("a", true && "b", false && "c")).toBe("a b");
    expect(cn("base", undefined && "extra", "always")).toBe("base always");
  });

  test("merges tailwind classes correctly", () => {
    // twMerge should handle conflicts
    expect(cn("px-2 py-2", "p-4")).toBe("p-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  test("handles falsy values", () => {
    expect(cn("a", null, undefined, false, "")).toBe("a");
  });

  test("supports arrays and objects", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
    expect(cn({ "bg-red-500": true, "text-white": true }, "p-4")).toBe("bg-red-500 text-white p-4");
  });

  test("handles complex nesting", () => {
    expect(cn("a", ["b", ["c", { d: true }]])).toBe("a b c d");
  });
});
