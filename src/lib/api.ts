const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let apiKey = "";
  if (typeof window !== "undefined") {
    apiKey = localStorage.getItem("x-api-key") || "";
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (apiKey) {
    headers.set("x-api-key", apiKey);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Auto redirect to login on 401
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("x-api-key");
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    let errorMsg = "API Request Failed";
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {
      // Ignore
    }
    throw new Error(errorMsg);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
