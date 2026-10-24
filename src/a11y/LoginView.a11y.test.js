import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import { axe, toHaveNoViolations } from "jest-axe";
import LoginView from "../views/LoginView.vue";
import { createRouter, createMemoryHistory } from "vue-router";

vi.mock("../services/api", () => ({
  login: vi.fn(),
}));

expect.extend(toHaveNoViolations);

function renderLoginView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: LoginView }],
  });

  return render(LoginView, {
    global: { plugins: [router] },
  });
}

describe("LoginView accessibility", () => {
  it("has no axe accessibility violations", async () => {
    const { container } = renderLoginView();
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("has inputs associated with visible labels", () => {
    renderLoginView();

    expect(screen.getByLabelText("E-postadress")).toBeTruthy();
    expect(screen.getByLabelText("Lösenord")).toBeTruthy();
  });
});
