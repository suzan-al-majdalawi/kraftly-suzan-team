import { getAccessToken, setAccessToken } from "./token";

const API_BASE = "/api/v2";

// Versionsnummer för autentiseringsoperationer.
// Ökas vid utloggning för att förhindra att äldre operationer ändrar token.
let authGeneration = 0;

// Återanvänd samma Refresh-anrop för alla samtidiga förfrågningar.
let refreshPromise = null;

// Gemensam funktion för alla API-anrop.
const request = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

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

// Logga in användaren.
export const login = async (email, password) => {
  const currentGeneration = authGeneration;

  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  // Ignorera resultatet från en äldre inloggning om utloggning har påbörjats.
  if (currentGeneration !== authGeneration) {
    throw new Error("Login operation was cancelled");
  }

  if (!data?.accessToken) {
    setAccessToken(null);
    throw new Error("API returned no access token");
  }

  setAccessToken(data.accessToken);

  return data;
};

// Återställ sessionen med hjälp av en Refresh Cookie.
export const refresh = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const currentGeneration = authGeneration;

  let currentPromise;

  currentPromise = (async () => {
    try {
      const data = await request("/auth/refresh", {
        method: "POST",
      });

      // Spara inte token om utloggning har påbörjats.
      if (currentGeneration !== authGeneration) {
        return null;
      }

      if (!data?.accessToken) {
        setAccessToken(null);
        return null;
      }

      setAccessToken(data.accessToken);

      return data;
    } catch (error) {
      // Ignorera resultatet från en äldre operation.
      if (currentGeneration !== authGeneration) {
        return null;
      }

      setAccessToken(null);

      if (error.status === 401) {
        return null;
      }

      throw error;
    } finally {
      if (refreshPromise === currentPromise) {
        refreshPromise = null;
      }
    }
  })();

  refreshPromise = currentPromise;

  return currentPromise;
};

// Alternativt funktionsnamn som används av routern.
export const refreshSession = refresh;

// Kontrollera om det finns en aktiv Access Token.
export const hasSession = () => {
  return Boolean(getAccessToken());
};

// Logga ut användaren och låt servern ta bort Refresh Cookie.
export const logout = async () => {
  // Ogiltigförklara alla autentiseringsoperationer som startades tidigare.
  authGeneration++;

  // Vänta tills en pågående Refresh-operation har avslutats
  // för att undvika konflikter när cookien tas bort.
  const pendingRefresh = refreshPromise;

  if (pendingRefresh) {
    try {
      await pendingRefresh;
    } catch {
      // Fortsätt med utloggningen även om Refresh-operationen misslyckas.
    }
  }

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

// Hämta förbrukningsuppgifter.
export const fetchConsumption = () => {
  return request("/consumption");
};

// Hämta fakturor.
export const fetchInvoices = () => {
  return request("/invoices");
};

// Skicka en flyttanmälan.
export const submitMove = (data) => {
  return request("/move", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
