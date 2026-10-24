import { test, expect } from "@playwright/test";

test("kunden kan logga in och ser sin översikt", async ({ page }) => {
  await page.goto("/login");
  await page
    .getByPlaceholder("E-postadress")
    .fill("anna.andersson@example.com");
  await page.getByPlaceholder("Lösenord").fill("sommar2026");
  await page.getByRole("button", { name: "Logga in" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hej Anna!");
});
