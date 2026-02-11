// File: frontend-web/src/services/explainabilityApi.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * EN:
 * Fetch explainability timeline by trace_id via Gateway.
 *
 * VI:
 * Lấy dữ liệu giải trình theo trace_id thông qua Gateway.
 */
export async function fetchExplainability(traceId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/explain/${traceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch explainability:", error);
    throw error;
  }
}
