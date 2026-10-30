import { getAccessToken, setAccessToken } from "./token";

const API_BASE = "/api/v2";

// Gemensam funktion för alla API-anrop.
const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Lägg till access token om den finns.
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Ingen responsdata vid 204.
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  // Hantera API-fel och spara HTTP-status.
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.error || data.message
        : data;

    const error = new Error(message || `API error ${response.status}`);

    error.status = response.status;

    throw error;
  }

  return data;
};

// Logga in och spara access token i minnet.
export const login = async (email, password) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!data?.accessToken) {
    setAccessToken(null);
    throw new Error("API returned no access token");
  }

  setAccessToken(data.accessToken);

  return data;
};

// Hämta en ny access token med hjälp av refresh-cookien.
export const refresh = async () => {
  // Ta bort eventuell gammal access token.
  setAccessToken(null);

  try {
    const data = await request("/auth/refresh", {
      method: "POST",
    });

    if (!data?.accessToken) {
      setAccessToken(null);
      return null;
    }

    setAccessToken(data.accessToken);

    return data;
  } catch (error) {
    setAccessToken(null);

    // Ingen giltig refresh-session.
    // Detta är normalt om användaren inte är inloggad.
    if (error.status === 401) {
      return null;
    }

    if (
      error.message?.includes("Sessionen har gått ut") ||
      error.message?.includes("Unauthorized")
    ) {
      return null;
    }

    // Andra fel ska fortfarande visas.
    throw error;
  }
};

// Namnet som används av routern.
export const refreshSession = refresh;

// Kontrollera om access token finns i minnet.
export const hasSession = () => {
  return Boolean(getAccessToken());
};

// Logga ut och låt servern ta bort refresh-cookien.
export const logout = async () => {
  try {
    await request("/auth/logout", {
      method: "POST",
    });
  } finally {
    setAccessToken(null);
  }
};

// Hämta användaruppgifter.
export const fetchUser = () => {
  return request("/user");
};

// Spara användaruppgifter.
export const saveUser = (data) => {
  return request("/user", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Hämta förbrukning.
export const fetchConsumption = () => {
  return request("/consumption");
};

// Hämta fakturor.
export const fetchInvoices = () => {
  return request("/invoices");
};

// Skicka flyttanmälan.
export const submitMove = (data) => {
  return request("/move", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
