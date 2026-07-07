const API_BASE_URL = "https://mock.api.local";

type RequestConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string>;
};

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { method = "GET", body, params } = config;

  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = "Erro inesperado ao comunicar com o servidor.";
    try {
      const errorBody = (await response.json()) as { message?: string } | null;
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();
  return data as T;
}

export const apiClient = {
  async get<T>(path: string, config?: { params?: Record<string, string> }): Promise<{ data: T }> {
    const data = await request<T>(path, { method: "GET", params: config?.params });
    return { data };
  },

  async post<T>(path: string, body?: unknown): Promise<{ data: T }> {
    const data = await request<T>(path, { method: "POST", body });
    return { data };
  },

  async put<T>(path: string, body?: unknown): Promise<{ data: T }> {
    const data = await request<T>(path, { method: "PUT", body });
    return { data };
  },

  async delete(path: string): Promise<{ data: void }> {
    const data = await request<void>(path, { method: "DELETE" });
    return { data };
  },
};
