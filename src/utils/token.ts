// src/utils/token.ts

import { authFetch } from "./authFetch";

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.warn("🔐 No refresh token available.");
    return null;
  }

  try {
    const res = await fetch("/api/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok || !data.access_token) {
      console.warn("❌ Failed to refresh token:", data?.detail || "Unknown error");
      return null;
    }

    localStorage.setItem("access_token", data.access_token);

    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    return data.access_token;
  } catch (err) {
    console.error("💥 Error during token refresh:", err);
    return null;
  }
};
