const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function handleResponse(res) {
  if (!res.ok) {
    const message = await res
      .json()
      .catch(() => ({ error: res.statusText || "Request failed" }));
    throw new Error(message.error || message.message || res.statusText);
  }
  return res.json();
}

export async function fetchRecommendations(profile) {
  const res = await fetch(`${API_BASE}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  return handleResponse(res);
}

export async function fetchFavorites(clientId) {
  const res = await fetch(`${API_BASE}/api/favorites/${clientId}`);
  return handleResponse(res);
}

export async function saveFavorites(clientId, favorites) {
  const res = await fetch(`${API_BASE}/api/favorites/${clientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorites }),
  });
  return handleResponse(res);
}

export function getApiBase() {
  return API_BASE;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function signup({ email, password, role, adminInviteCode }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role, adminInviteCode }),
  });
  return handleResponse(res);
}

export async function fetchMe(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}
