// src/utils/authFetch.ts

export const authFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  let accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  const headers: HeadersInit = {
    ...(init.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status !== 401 || !refreshToken) {
    return response;
  }

  // Try to refresh the token
  const refreshResponse = await fetch('api/token/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!refreshResponse.ok) {
    // Optional: handle forced logout if refresh fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return response; // original 401
  }

  const newTokens = await refreshResponse.json();
  localStorage.setItem('access_token', newTokens.access_token);
  localStorage.setItem('refresh_token', newTokens.refresh_token);

  // Retry original request with new token
  return fetch(input, {
    ...init,
    headers: {
      ...headers,
      Authorization: `Bearer ${newTokens.access_token}`,
      "Content-Type": "application/json"
    }
  });
};
