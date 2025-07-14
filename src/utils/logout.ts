// src/utils/logoutUser.ts
import { authFetch } from "./authFetch";
import { toast } from "react-toastify";

export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem("access_token");

  try {
    if (token) {
      await authFetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    }
    
  } catch (err) {
    console.error("Logout request failed:", err);
    // Silently fail if server is down or token is bad—client will still log out
  }

  // Remove session-related local data
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userName");
  toast.success("Logged out successfully");
  // Optional: reload or redirect
  window.location.href="/";
};

