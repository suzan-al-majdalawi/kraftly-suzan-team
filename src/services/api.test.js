import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchInvoices, login, logout, refresh } from "./api";
import { getAccessToken, setAccessToken } from "./token";

const TEST_TOKEN = "test-token-abc";
const OLD_TOKEN = "test-token-old";
const NEW_TOKEN = "test-token-new";

const jsonResponse = (status, body) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  localStorage.clear();
  sessionStorage.clear();
  setAccessToken(null);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("login", () => {
  it("stores access token in memory, not browser storage", async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse(200, {
        accessToken: TEST_TOKEN,
        expiresIn: 600,
        name: "Anna Andersson",
      }),
    );

    const data = await login("anna.andersson@example.com", "kraftly-anna");

    expect(data.name).toBe("Anna Andersson");
    expect(getAccessToken()).toBe(TEST_TOKEN);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});

describe("protected API requests", () => {
  it("sends access token as Bearer header", async () => {
    setAccessToken(TEST_TOKEN);
    fetch.mockResolvedValueOnce(jsonResponse(200, []));

    await fetchInvoices();

    const [url, options] = fetch.mock.calls[0];

    expect(url).toBe("/api/v2/invoices");
    expect(options.headers.get("Authorization")).toBe(`Bearer ${TEST_TOKEN}`);
    expect(options.credentials).toBe("include");
  });
});

describe("refresh", () => {
  it("stores a new access token after successful refresh", async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse(200, {
        accessToken: NEW_TOKEN,
        expiresIn: 600,
        name: "Anna",
      }),
    );

    const data = await refresh();

    expect(data.accessToken).toBe(NEW_TOKEN);
    expect(getAccessToken()).toBe(NEW_TOKEN);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe("/api/v2/auth/refresh");
  });

  it("clears access token when refresh returns 401", async () => {
    setAccessToken(OLD_TOKEN);

    fetch.mockResolvedValueOnce(
      jsonResponse(401, {
        error: "Session has expired, please log in again",
      }),
    );

    const data = await refresh();

    expect(data).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it("shares one refresh request between concurrent calls", async () => {
    let resolveRefresh;

    fetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );

    const firstRefresh = refresh();
    const secondRefresh = refresh();

    expect(fetch).toHaveBeenCalledTimes(1);

    resolveRefresh(
      jsonResponse(200, {
        accessToken: NEW_TOKEN,
        expiresIn: 600,
        name: "Anna",
      }),
    );

    const [firstResult, secondResult] = await Promise.all([
      firstRefresh,
      secondRefresh,
    ]);

    expect(firstResult.accessToken).toBe(NEW_TOKEN);
    expect(secondResult.accessToken).toBe(NEW_TOKEN);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("allows retry after a network error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network unavailable"));

    fetch.mockResolvedValueOnce(
      jsonResponse(200, {
        accessToken: NEW_TOKEN,
        expiresIn: 600,
        name: "Anna",
      }),
    );

    await expect(refresh()).rejects.toThrow("Network unavailable");

    const data = await refresh();

    expect(data.accessToken).toBe(NEW_TOKEN);
    expect(getAccessToken()).toBe(NEW_TOKEN);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("logout", () => {
  it("clears access token even when server request fails", async () => {
    setAccessToken(TEST_TOKEN);

    fetch.mockRejectedValueOnce(new Error("Network unavailable"));

    await expect(logout()).rejects.toThrow();
    expect(getAccessToken()).toBeNull();
  });
});
