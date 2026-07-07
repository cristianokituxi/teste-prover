import { http, HttpResponse } from "msw";

import { db } from "@/src/shared/services/db";
import type { SchoolClassInput, SchoolInput } from "@/src/features/schools/types";

const API_URL = "https://mock.api.local";

export const handlers = [
  http.get(`${API_URL}/schools`, () => {
    return HttpResponse.json(db.listSchools());
  }),

  http.post(`${API_URL}/schools`, async ({ request }) => {
    const body = (await request.json()) as Partial<SchoolInput>;
    if (!body.name?.trim() || !body.address?.trim()) {
      return HttpResponse.json({ message: "Nome e endereço são obrigatórios." }, { status: 400 });
    }
    return HttpResponse.json(db.createSchool({ name: body.name.trim(), address: body.address.trim() }), { status: 201 });
  }),

  http.put(`${API_URL}/schools/:id`, async ({ request, params }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<SchoolInput>;
    if (!body.name?.trim() || !body.address?.trim()) {
      return HttpResponse.json({ message: "Nome e endereço são obrigatórios." }, { status: 400 });
    }
    const updated = db.updateSchool(id as string, { name: body.name.trim(), address: body.address.trim() });
    if (!updated) return HttpResponse.json({ message: "Escola não encontrada." }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_URL}/schools/:id`, ({ params }) => {
    const { id } = params;
    const removed = db.deleteSchool(id as string);
    if (!removed) return HttpResponse.json({ message: "Escola não encontrada." }, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/classes`, ({ request }) => {
    const url = new URL(request.url);
    const schoolId = url.searchParams.get("schoolId");
    if (!schoolId) return HttpResponse.json({ message: "schoolId é obrigatório." }, { status: 400 });
    if (!db.hasSchool(schoolId)) return HttpResponse.json({ message: "Escola não encontrada." }, { status: 404 });
    return HttpResponse.json(db.listClasses(schoolId));
  }),

  http.post(`${API_URL}/classes`, async ({ request }) => {
    const body = (await request.json()) as Partial<SchoolClassInput> & { schoolId?: string };
    if (!body.schoolId || !db.hasSchool(body.schoolId)) {
      return HttpResponse.json({ message: "Escola não encontrada." }, { status: 404 });
    }
    if (!body.name?.trim() || !body.shift || !body.year) {
      return HttpResponse.json({ message: "Nome, turno e ano letivo são obrigatórios." }, { status: 400 });
    }
    return HttpResponse.json(
      db.createClass(body.schoolId, { name: body.name.trim(), shift: body.shift, year: body.year }),
      { status: 201 },
    );
  }),

  http.put(`${API_URL}/classes/:id`, async ({ request, params }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<SchoolClassInput>;
    if (!body.name?.trim() || !body.shift || !body.year) {
      return HttpResponse.json({ message: "Nome, turno e ano letivo são obrigatórios." }, { status: 400 });
    }
    const updated = db.updateClass(id as string, { name: body.name.trim(), shift: body.shift, year: body.year });
    if (!updated) return HttpResponse.json({ message: "Turma não encontrada." }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete(`${API_URL}/classes/:id`, ({ params }) => {
    const { id } = params;
    const removed = db.deleteClass(id as string);
    if (!removed) return HttpResponse.json({ message: "Turma não encontrada." }, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),
];
