import { test, expect } from "@playwright/test";

test("Här kan användaren logga in på systemet", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByPlaceholder("E-postadress")
    .fill("anna.andersson@example.com");
  await page.getByPlaceholder("Lösenord").fill("sommar2026");

  await page.getByRole("button", { name: "Logga in" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText("Mina uppgifter")).toBeVisible();
});
