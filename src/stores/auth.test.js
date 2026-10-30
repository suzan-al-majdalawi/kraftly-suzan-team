import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./auth";
import * as api from "../services/api";
import { setAccessToken } from "../services/token";

vi.mock("../services/api", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
  setAccessToken(null);
  vi.clearAllMocks();
});

describe("auth store", () => {
  it("är utloggad från början", () => {
    expect(useAuthStore().isAuthenticated).toBe(false);
  });

  it("login sätter namn och inloggat läge", async () => {
    api.login.mockImplementation(async () => {
      setAccessToken("test-token");
      return { name: "Anna Andersson" };
    });

    const auth = useAuthStore();

    await auth.login("anna@example.com", "password");

    expect(auth.isAuthenticated).toBe(true);
    expect(auth.name).toBe("Anna Andersson");
  });

  it("restore lyckas när refresh ger en ny token", async () => {
    api.refresh.mockImplementation(async () => {
      setAccessToken("new-token");
      return { name: "Anna Andersson" };
    });

    const auth = useAuthStore();

    expect(await auth.restore()).toBe(true);
    expect(auth.name).toBe("Anna Andersson");
  });

  it("restore utan session ger utloggat läge", async () => {
    api.refresh.mockResolvedValue(null);

    const auth = useAuthStore();

    expect(await auth.restore()).toBe(false);
    expect(await auth.restore()).toBe(false);
    expect(api.refresh).toHaveBeenCalledTimes(1);
  });

  it("logout tar bort token och namn", async () => {
    api.logout.mockImplementation(async () => {
      setAccessToken(null);
    });

    setAccessToken("test-token");

    const auth = useAuthStore();
    auth.name = "Anna Andersson";

    await auth.logout();

    expect(auth.isAuthenticated).toBe(false);
    expect(auth.name).toBeNull();
  });
});
