import { db } from "@/src/shared/services/db";
import type { School, SchoolClass } from "@/src/features/schools/types";
import type { SchoolInput } from "@/src/features/schools/types";
import type { SchoolClassInput } from "@/src/features/classes/types";
import type { Shift } from "@/src/features/schools/types";

const SIMULATED_LATENCY_MS = 150;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = {
  async get<T>(path: string, config?: { params?: Record<string, string> }): Promise<{ data: T }> {
    await delay(SIMULATED_LATENCY_MS);

    if (path === "/schools") {
      const schools = await db.listSchools();
      return { data: schools as T };
    }

    if (path === "/classes" && config?.params?.schoolId) {
      const classes = await db.listClasses(config.params.schoolId);
      return { data: classes as T };
    }

    throw new Error(`Rota não encontrada: GET ${path}`);
  },

  async post<T>(path: string, body?: unknown): Promise<{ data: T }> {
    await delay(SIMULATED_LATENCY_MS);

    if (path === "/schools") {
      const input = body as SchoolInput;
      if (!input?.name?.trim() || !input?.address?.trim()) {
        throw new Error("Nome e endereço são obrigatórios.");
      }
      const school = await db.createSchool({ name: input.name.trim(), address: input.address.trim() });
      return { data: school as T };
    }

    if (path === "/classes") {
      const payload = body as SchoolClassInput & { schoolId?: string };
      if (!payload?.schoolId || !(await db.hasSchool(payload.schoolId))) {
        throw new Error("Escola não encontrada.");
      }
      if (!payload?.name?.trim() || !payload?.shift || !payload?.year) {
        throw new Error("Nome, turno e ano letivo são obrigatórios.");
      }
      const cls = await db.createClass(payload.schoolId, {
        name: payload.name.trim(),
        shift: payload.shift as Shift,
        year: payload.year,
      });
      return { data: cls as T };
    }

    throw new Error(`Rota não encontrada: POST ${path}`);
  },

  async put<T>(path: string, body?: unknown): Promise<{ data: T }> {
    await delay(SIMULATED_LATENCY_MS);

    const schoolMatch = path.match(/^\/schools\/([^/]+)$/);
    if (schoolMatch) {
      const input = body as SchoolInput;
      if (!input?.name?.trim() || !input?.address?.trim()) {
        throw new Error("Nome e endereço são obrigatórios.");
      }
      const updated = await db.updateSchool(schoolMatch[1], { name: input.name.trim(), address: input.address.trim() });
      if (!updated) throw new Error("Escola não encontrada.");
      return { data: updated as T };
    }

    const classMatch = path.match(/^\/classes\/([^/]+)$/);
    if (classMatch) {
      const input = body as SchoolClassInput;
      if (!input?.name?.trim() || !input?.shift || !input?.year) {
        throw new Error("Nome, turno e ano letivo são obrigatórios.");
      }
      const updated = await db.updateClass(classMatch[1], {
        name: input.name.trim(),
        shift: input.shift as Shift,
        year: input.year,
      });
      if (!updated) throw new Error("Turma não encontrada.");
      return { data: updated as T };
    }

    throw new Error(`Rota não encontrada: PUT ${path}`);
  },

  async delete(path: string): Promise<{ data: void }> {
    await delay(SIMULATED_LATENCY_MS);

    const schoolMatch = path.match(/^\/schools\/([^/]+)$/);
    if (schoolMatch) {
      const removed = await db.deleteSchool(schoolMatch[1]);
      if (!removed) throw new Error("Escola não encontrada.");
      return { data: undefined };
    }

    const classMatch = path.match(/^\/classes\/([^/]+)$/);
    if (classMatch) {
      const removed = await db.deleteClass(classMatch[1]);
      if (!removed) throw new Error("Turma não encontrada.");
      return { data: undefined };
    }

    throw new Error(`Rota não encontrada: DELETE ${path}`);
  },
};
