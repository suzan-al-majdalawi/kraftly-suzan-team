export function getSafeRedirect(redirect) {
  if (typeof redirect !== "string" || !redirect.startsWith("/")) {
    return "/";
  }

  if (redirect.startsWith("//") || redirect.includes("\\")) {
    return "/";
  }

  try {
    const url = new URL(redirect, window.location.origin);

    if (url.origin !== window.location.origin) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}
