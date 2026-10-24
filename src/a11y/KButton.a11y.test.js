import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import { axe, toHaveNoViolations } from "jest-axe";
import KButton from "../components/KButton.vue";

expect.extend(toHaveNoViolations);

describe("KButton accessibility", () => {
  it("has no axe accessibility violations", async () => {
    const { container } = render(KButton, {
      slots: { default: "Spara ändringar" },
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders a real button with the correct type", () => {
    const { container } = render(KButton, {
      slots: { default: "Spara ändringar" },
      props: { type: "button" },
    });

    const button = container.querySelector("button");

    expect(button).not.toBeNull();
    expect(button.getAttribute("type")).toBe("button");
    expect(button.textContent.trim()).toBe("Spara ändringar");
  });
});
