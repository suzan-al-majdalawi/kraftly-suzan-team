import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import { axe, toHaveNoViolations } from "jest-axe";
import KField from "../components/KField.vue";

expect.extend(toHaveNoViolations);

describe("KField accessibility", () => {
  it("has a label connected to the input", () => {
    render(KField, {
      props: { label: "Email Address" },
      attrs: { type: "email" },
    });

    const input = screen.getByLabelText("Email Address");

    expect(input).toBeTruthy();
    expect(input.getAttribute("type")).toBe("email");
  });

  it("has no axe accessibility violations with a hint and an error", async () => {
    const { container } = render(KField, {
      props: {
        label: "Postal code",
        hint: "Five digits",
        error: "Postal code must contain five digits",
      },
    });

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
