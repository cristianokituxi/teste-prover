import { db } from "@/src/shared/services/db";
import type { SchoolClassInput, SchoolInput } from "@/src/features/schools/types";

const API_URL = "https://mock.api.local";

let isStarted = false;
let originalFetch: typeof global.fetch | null = null;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function emptyResponse(status = 204): Response {
  return new Response(null, { status });
}

function parsePath(pathname: string): { segments: string[]; query: URLSearchParams } {
  try {
    const url = new URL(pathname, API_URL);
    return { segments: url.pathname.replace(/^\/+/, "").split("/"), query: url.searchParams };
  } catch {
    return { segments: pathname.replace(/^\/+/, "").split("/"), query: new URLSearchParams() };
  }
}

function parseBody(body?: BodyInit | null): unknown {
  if (typeof body !== "string") return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function handleRequest(url: string, method: string, body?: BodyInit | null): Response {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }

  // GET /schools
  if (path === "/schools" && method === "GET") {
    return jsonResponse(db.listSchools());
  }

  // POST /schools
  if (path === "/schools" && method === "POST") {
    const payload = parseBody(body) as Partial<SchoolInput> | null;
    if (!payload?.name?.trim() || !payload?.address?.trim()) {
      return jsonResponse({ message: "Nome e endereço são obrigatórios." }, 400);
    }
    return jsonResponse(db.createSchool({ name: payload.name.trim(), address: payload.address.trim() }), 201);
  }

  // PUT /schools/:id
  const putSchoolMatch = path.match(/^\/schools\/([^/]+)$/);
  if (putSchoolMatch && method === "PUT") {
    const payload = parseBody(body) as Partial<SchoolInput> | null;
    if (!payload?.name?.trim() || !payload?.address?.trim()) {
      return jsonResponse({ message: "Nome e endereço são obrigatórios." }, 400);
    }
    const updated = db.updateSchool(putSchoolMatch[1], { name: payload.name.trim(), address: payload.address.trim() });
    if (!updated) return jsonResponse({ message: "Escola não encontrada." }, 404);
    return jsonResponse(updated);
  }

  // DELETE /schools/:id
  const deleteSchoolMatch = path.match(/^\/schools\/([^/]+)$/);
  if (deleteSchoolMatch && method === "DELETE") {
    const removed = db.deleteSchool(deleteSchoolMatch[1]);
    if (!removed) return jsonResponse({ message: "Escola não encontrada." }, 404);
    return emptyResponse(204);
  }

  // GET /classes?schoolId=
  if (path === "/classes" && method === "GET") {
    const urlObj = new URL(url);
    const schoolId = urlObj.searchParams.get("schoolId");
    if (!schoolId) return jsonResponse({ message: "schoolId é obrigatório." }, 400);
    if (!db.hasSchool(schoolId)) return jsonResponse({ message: "Escola não encontrada." }, 404);
    return jsonResponse(db.listClasses(schoolId));
  }

  // POST /classes
  if (path === "/classes" && method === "POST") {
    const payload = parseBody(body) as (Partial<SchoolClassInput> & { schoolId?: string }) | null;
    if (!payload?.schoolId || !db.hasSchool(payload.schoolId)) {
      return jsonResponse({ message: "Escola não encontrada." }, 404);
    }
    if (!payload?.name?.trim() || !payload?.shift || !payload?.year) {
      return jsonResponse({ message: "Nome, turno e ano letivo são obrigatórios." }, 400);
    }
    return jsonResponse(
      db.createClass(payload.schoolId, { name: payload.name.trim(), shift: payload.shift, year: payload.year }),
      201,
    );
  }

  // PUT /classes/:id
  const putClassMatch = path.match(/^\/classes\/([^/]+)$/);
  if (putClassMatch && method === "PUT") {
    const payload = parseBody(body) as Partial<SchoolClassInput> | null;
    if (!payload?.name?.trim() || !payload?.shift || !payload?.year) {
      return jsonResponse({ message: "Nome, turno e ano letivo são obrigatórios." }, 400);
    }
    const updated = db.updateClass(putClassMatch[1], {
      name: payload.name.trim(),
      shift: payload.shift,
      year: payload.year,
    });
    if (!updated) return jsonResponse({ message: "Turma não encontrada." }, 404);
    return jsonResponse(updated);
  }

  // DELETE /classes/:id
  const deleteClassMatch = path.match(/^\/classes\/([^/]+)$/);
  if (deleteClassMatch && method === "DELETE") {
    const removed = db.deleteClass(deleteClassMatch[1]);
    if (!removed) return jsonResponse({ message: "Turma não encontrada." }, 404);
    return emptyResponse(204);
  }

  return jsonResponse({ message: "Endpoint não encontrado." }, 404);
}

export function startMockServer(): void {
  if (isStarted) return;

  originalFetch = global.fetch;

  global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url.startsWith(API_URL)) {
      const method = (init?.method ?? "GET").toUpperCase();
      return handleRequest(url, method, init?.body);
    }

    if (!originalFetch) {
      throw new Error("Fetch original não disponível.");
    }

    return originalFetch(input, init);
  };

  isStarted = true;
}

export function stopMockServer(): void {
  if (originalFetch) {
    global.fetch = originalFetch;
  }
  originalFetch = null;
  isStarted = false;
}
