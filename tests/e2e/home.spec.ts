import { test, expect } from "@playwright/test";

test.describe("홈", () => {
  test("접두사 없는 경로로 진입하면 한국어로 보여준다", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("우리 동네 분실물 찾기, 찾길");
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  });

  test("영어 경로로 진입하면 영어로 보여준다", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveTitle("Find lost items near you, finditem!");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
