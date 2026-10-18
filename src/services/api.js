// API client for Kraftly M6
// Access token stays in memory, never in localStorage.

const BASE_URL = "";
let accessToken = null;

const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.error || data.message
        : data;

    throw new Error(message || `API error ${res.status}`);
  }

  return data;
};

export const login = async (email, password) => {
  const data = await request("/api/v2/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data.accessToken ?? data.token;

  if (!token) {
    throw new Error("API returned no access token");
  }

  accessToken = token;
  return data;
};

export const refresh = async () => {
  const data = await request("/api/v2/auth/refresh", {
    method: "POST",
  });

  const token = data.accessToken ?? data.token;

  if (!token) {
    accessToken = null;
    throw new Error("Refresh returned no access token");
  }

  accessToken = token;
  return data;
};

export const logout = async () => {
  try {
    await request("/api/v2/auth/logout", {
      method: "POST",
    });
  } finally {
    accessToken = null;
  }
};

export const fetchUser = () => request("/api/v2/user");
export const fetchConsumption = () => request("/api/v2/consumption");
export const fetchInvoices = () => request("/api/v2/invoices");

export const submitMove = (data) =>
  request("/api/v2/move", {
    method: "POST",
    body: JSON.stringify(data),
  });
