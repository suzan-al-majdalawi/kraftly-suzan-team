let accessToken = null;
let refreshPromise = null;

const request = async (path, options = {}, retry = true) => {
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

  if (
    response.status === 401 &&
    retry &&
    path !== "/api/v2/auth/login" &&
    path !== "/api/v2/auth/refresh"
  ) {
    const refreshed = await refreshSession();

    if (refreshed) {
      return request(path, options, false);
    }

    accessToken = null;
  }

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

export const refreshSession = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const data = await request(
        "/api/v2/auth/refresh",
        { method: "POST" },
        false,
      );

      const token = data?.accessToken ?? data?.access_token ?? data?.token;

      if (!token) {
        accessToken = null;
        return false;
      }

      accessToken = token;
      return true;
    } catch {
      accessToken = null;
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const login = async (email, password) => {
  const data = await request(
    "/api/v2/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );

  const token = data?.accessToken ?? data?.access_token ?? data?.token;

  if (!token) {
    accessToken = null;
    throw new Error("API returned no access token");
  }

  accessToken = token;
  return data;
};

export const logout = async () => {
  try {
    await request("/api/v2/auth/logout", { method: "POST" }, false);
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

export const saveUser = (data) =>
  request("/api/v2/user", {
    method: "PUT",
    body: JSON.stringify(data),
  });
