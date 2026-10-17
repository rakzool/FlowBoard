import { expect, test } from "@playwright/test";

test("switching users filters the sidebar tree", async ({ page }) => {
  await page.goto("/");
  const sidebar = page.locator("aside");

  await expect(sidebar.getByText("Engineering", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Product", { exact: true })).toBeVisible();
  await sidebar.getByRole("button", { name: "▰ Platform" }).click();
  await expect(
    sidebar.getByRole("button", { name: "Sprint board", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Open account menu" }).click();
  await page.getByRole("button", { name: "Bob" }).click();

  await expect(sidebar.getByText("Engineering", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Product", { exact: true })).toHaveCount(0);
  await expect(
    sidebar.getByRole("button", { name: "Sprint board", exact: true }),
  ).toBeVisible();
  await expect(sidebar.getByRole("button", { name: "Product roadmap" })).toHaveCount(0);
});
