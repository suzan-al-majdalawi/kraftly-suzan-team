import { test, expect } from "@playwright/test";

test("Här kan användaren logga in på systemet", async ({ page }) => {
  page.on("response", async (response) => {
    if (response.url().includes("/api/") && response.status() >= 400) {
      console.log(
        "API-fel:",
        response.status(),
        response.url(),
        await response.text().catch(() => ""),
      );
    }
  });

  page.on("pageerror", (error) => {
    console.log("JavaScript-fel:", error.message);
  });

  await page.goto("/login");

  await page
    .getByPlaceholder("E-postadress")
    .fill("anna.andersson@example.com");

  await page.getByPlaceholder("Lösenord").fill("sommar2026");

  await page.getByRole("button", { name: "Logga in" }).click();

  // Vänta på att inloggningen lyckas
  await expect(page).toHaveURL("http://localhost:8080/", { timeout: 10000 });

  await expect(page.getByText("Mina uppgifter")).toBeVisible();
});
