import type { School, SchoolClass } from "@/src/features/schools/types";
import type { Shift } from "@/src/features/schools/types";

const now = () => new Date().toISOString();
const createId = () => Math.random().toString(36).slice(2, 11);

type SchoolRecord = Omit<School, "classCount">;

let schools: SchoolRecord[] = [
  { id: "sch-1", name: "Escola Municipal Monteiro Lobato", address: "Rua das Acácias, 450 - Centro", createdAt: now() },
  { id: "sch-2", name: "Escola Estadual Paulo Freire", address: "Av. dos Bandeirantes, 1200 - Jardins", createdAt: now() },
];

let classes: SchoolClass[] = [
  { id: "cls-1", schoolId: "sch-1", name: "1º Ano A", shift: "Morning" as Shift, year: 2026, createdAt: now() },
  { id: "cls-2", schoolId: "sch-1", name: "2º Ano B", shift: "Afternoon" as Shift, year: 2026, createdAt: now() },
  { id: "cls-3", schoolId: "sch-2", name: "3º Ano C", shift: "Night" as Shift, year: 2026, createdAt: now() },
];

export const db = {
  listSchools(): School[] {
    return schools.map((s) => ({
      ...s,
      classCount: classes.filter((c) => c.schoolId === s.id).length,
    }));
  },

  getSchool(id: string): School | null {
    const s = schools.find((s) => s.id === id);
    if (!s) return null;
    return { ...s, classCount: classes.filter((c) => c.schoolId === id).length };
  },

  createSchool(data: { name: string; address: string }): School {
    const record: SchoolRecord = { id: createId(), name: data.name, address: data.address, createdAt: now() };
    schools.push(record);
    return { ...record, classCount: 0 };
  },

  updateSchool(id: string, data: { name: string; address: string }): School | null {
    const idx = schools.findIndex((s) => s.id === id);
    if (idx < 0) return null;
    schools[idx] = { ...schools[idx], name: data.name, address: data.address };
    return { ...schools[idx], classCount: classes.filter((c) => c.schoolId === id).length };
  },

  deleteSchool(id: string): boolean {
    const idx = schools.findIndex((s) => s.id === id);
    if (idx < 0) return false;
    schools.splice(idx, 1);
    for (let i = classes.length - 1; i >= 0; i--) {
      if (classes[i].schoolId === id) classes.splice(i, 1);
    }
    return true;
  },

  listClasses(schoolId: string): SchoolClass[] {
    return classes.filter((c) => c.schoolId === schoolId);
  },

  createClass(schoolId: string, data: { name: string; shift: Shift; year: number }): SchoolClass {
    const record: SchoolClass = { id: createId(), schoolId, ...data, createdAt: now() };
    classes.push(record);
    return record;
  },

  updateClass(id: string, data: { name: string; shift: Shift; year: number }): SchoolClass | null {
    const idx = classes.findIndex((c) => c.id === id);
    if (idx < 0) return null;
    classes[idx] = { ...classes[idx], ...data };
    return classes[idx];
  },

  deleteClass(id: string): boolean {
    const idx = classes.findIndex((c) => c.id === id);
    if (idx < 0) return false;
    classes.splice(idx, 1);
    return true;
  },

  hasSchool(id: string): boolean {
    return schools.some((s) => s.id === id);
  },
};
