import { storageService } from "@/src/shared/services/storageService";
import { connectivityService } from "@/src/shared/services/connectivityService";
import { queueService } from "@/src/shared/services/queueService";
import type { School, SchoolClass } from "@/src/features/schools/types";
import type { SchoolClassInput } from "@/src/features/classes/types";
import type { Shift } from "@/src/features/schools/types";

const now = () => new Date().toISOString();
const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const db = {
  async init(): Promise<void> {
    await storageService.loadSeedIfNeeded();
  },

  async listSchools(): Promise<School[]> {
    const schools = await storageService.getSchools();
    const classes = await storageService.getClasses();
    return schools.map((s) => ({
      ...s,
      classCount: classes.filter((c) => c.schoolId === s.id).length,
    }));
  },

  async getSchool(id: string): Promise<School | null> {
    const schools = await storageService.getSchools();
    const s = schools.find((s) => s.id === id);
    if (!s) return null;
    const classes = await storageService.getClasses();
    return { ...s, classCount: classes.filter((c) => c.schoolId === id).length };
  },

  async createSchool(data: { name: string; address: string }): Promise<School> {
    const id = createId();
    const school: School = {
      id,
      name: data.name,
      address: data.address,
      classCount: 0,
      createdAt: now(),
    };
    const schools = await storageService.getSchools();
    schools.push(school);
    await storageService.saveSchools(schools);

    if (!connectivityService.isConnected) {
      await queueService.add("CREATE_SCHOOL", id, data);
    }
    return school;
  },

  async updateSchool(id: string, data: { name: string; address: string }): Promise<School | null> {
    const schools = await storageService.getSchools();
    const idx = schools.findIndex((s) => s.id === id);
    if (idx < 0) return null;
    schools[idx] = { ...schools[idx], name: data.name, address: data.address };
    await storageService.saveSchools(schools);

    if (!connectivityService.isConnected) {
      await queueService.add("UPDATE_SCHOOL", id, data);
    }
    const classes = await storageService.getClasses();
    return { ...schools[idx], classCount: classes.filter((c) => c.schoolId === id).length };
  },

  async deleteSchool(id: string): Promise<boolean> {
    const schools = await storageService.getSchools();
    const idx = schools.findIndex((s) => s.id === id);
    if (idx < 0) return false;
    schools.splice(idx, 1);
    await storageService.saveSchools(schools);

    const classes = await storageService.getClasses();
    const filtered = classes.filter((c) => c.schoolId !== id);
    await storageService.saveClasses(filtered);

    if (!connectivityService.isConnected) {
      await queueService.add("DELETE_SCHOOL", id);
    }
    return true;
  },

  async listClasses(schoolId: string): Promise<SchoolClass[]> {
    const classes = await storageService.getClasses();
    return classes.filter((c) => c.schoolId === schoolId);
  },

  async createClass(
    schoolId: string,
    data: { name: string; shift: Shift; year: number },
  ): Promise<SchoolClass> {
    const id = createId();
    const cls: SchoolClass = { id, schoolId, ...data, createdAt: now() };
    const classes = await storageService.getClasses();
    classes.push(cls);
    await storageService.saveClasses(classes);

    if (!connectivityService.isConnected) {
      await queueService.add("CREATE_CLASS", id, data, schoolId);
    }
    return cls;
  },

  async updateClass(
    id: string,
    data: { name: string; shift: Shift; year: number },
  ): Promise<SchoolClass | null> {
    const classes = await storageService.getClasses();
    const idx = classes.findIndex((c) => c.id === id);
    if (idx < 0) return null;
    classes[idx] = { ...classes[idx], ...data };
    await storageService.saveClasses(classes);

    if (!connectivityService.isConnected) {
      await queueService.add("UPDATE_CLASS", id, data);
    }
    return classes[idx];
  },

  async deleteClass(id: string): Promise<boolean> {
    const classes = await storageService.getClasses();
    const idx = classes.findIndex((c) => c.id === id);
    if (idx < 0) return false;
    classes.splice(idx, 1);
    await storageService.saveClasses(classes);

    if (!connectivityService.isConnected) {
      await queueService.add("DELETE_CLASS", id);
    }
    return true;
  },

  async hasSchool(id: string): Promise<boolean> {
    const schools = await storageService.getSchools();
    return schools.some((s) => s.id === id);
  },
};
