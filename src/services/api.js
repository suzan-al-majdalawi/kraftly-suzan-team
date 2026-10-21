let accessToken = null;

const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.error || data.message
        : data;

    throw new Error(message || `API error ${response.status}`);
  }

  return data;
};

export const hasSession = () => Boolean(accessToken);

// Mock-API:t har ingen refresh-endpoint.
// En omladdning av sidan kräver därför ny inloggning.
export const refreshSession = async () => {
  accessToken = null;
  return false;
};

export const login = async (email, password) => {
  const data = await request("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = data?.token;

  if (!token) {
    accessToken = null;
    throw new Error("API returned no access token");
  }

  accessToken = token;
  return data;
};

export const logout = () => {
  accessToken = null;
  return Promise.resolve();
};

export const fetchUser = () => request("/api/user");
export const fetchConsumption = () => request("/api/consumption");
export const fetchInvoices = () => request("/api/invoices");
export const fetchMessages = () => request("/api/messages");

export const submitMove = (data) =>
  request("/api/move", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const saveUser = (data) =>
  request("/api/user", {
    method: "PUT",
    body: JSON.stringify(data),
  });
