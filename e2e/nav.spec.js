import { test, expect } from "@playwright/test";

test("navigation between different pages work", async ({ page }) => {
  await page.goto("/login");
  await page
    .getByPlaceholder("E-postadress")
    .fill("anna.andersson@example.com");
  await page.getByPlaceholder("Lösenord").fill("kraftly-anna");

  await page.getByRole("button", { name: "Logga in" }).click();

  // Kontrollera att inloggningen faktiskt lyckades.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hej Anna!");
  await page.getByRole("link", { name: "Fakturor" }).click();
  await expect(page).toHaveURL(/\/fakturor/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fakturor");

  await page.getByRole("link", { name: "Flyttanmälan" }).click();
  await expect(page).toHaveURL(/\/flytt/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Flyttanmälan",
  );

  await page.getByRole("link", { name: "Mina uppgifter" }).click();
  await expect(page).toHaveURL(/\/profil/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Mina uppgifter",
  );
});
