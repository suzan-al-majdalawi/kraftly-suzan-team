let accessToken = null;
let refreshPromise = null;

const request = async (path, options = {}, retry = true) => {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retry && path !== "/api/v2/auth/login") {
    const refreshed = await refreshSession();

    if (refreshed) {
      return request(path, options, false);
    }

    accessToken = null;
  }

  if (!response.ok) {
    throw new Error(`API-fel: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const refreshSession = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch("/api/v2/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        accessToken = null;
        return false;
      }

      const data = await response.json();
      accessToken = data.accessToken || data.access_token || null;
      return Boolean(accessToken);
    } catch {
      accessToken = null;
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const hasSession = () => Boolean(accessToken);

export const login = async (email, password) => {
  const data = await request(
    "/api/v2/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );

  accessToken = data.accessToken || data.access_token || null;

  if (!accessToken) {
    throw new Error("Inloggningen returnerade ingen access-token.");
  }

  return data;
};

export const logout = async () => {
  try {
    await fetch("/api/v2/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
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

export const saveUser = (data) =>
  request("/api/v2/user", {
    method: "PUT",
    body: JSON.stringify(data),
  });
