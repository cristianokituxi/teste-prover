import AsyncStorage from "@react-native-async-storage/async-storage";
import type { School, SchoolClass } from "@/src/features/schools/types";
import type { Shift } from "@/src/features/schools/types";

const SCHOOLS_KEY = "@desafio-prover:schools:v2";
const CLASSES_KEY = "@desafio-prover:classes:v2";

let seedLoaded = false;

const SEED_SCHOOLS: School[] = [
  {
    id: "sch-1",
    name: "Escola Municipal Monteiro Lobato",
    address: "Rua das Acácias, 450 - Centro",
    classCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sch-2",
    name: "Escola Estadual Paulo Freire",
    address: "Av. dos Bandeirantes, 1200 - Jardins",
    classCount: 1,
    createdAt: new Date().toISOString(),
  },
];

const SEED_CLASSES: SchoolClass[] = [
  {
    id: "cls-1",
    schoolId: "sch-1",
    name: "1º Ano A",
    shift: "Morning" as Shift,
    year: 2026,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cls-2",
    schoolId: "sch-1",
    name: "2º Ano B",
    shift: "Afternoon" as Shift,
    year: 2026,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cls-3",
    schoolId: "sch-2",
    name: "3º Ano C",
    shift: "Night" as Shift,
    year: 2026,
    createdAt: new Date().toISOString(),
  },
];

export const storageService = {
  async loadSeedIfNeeded(): Promise<void> {
    if (seedLoaded) return;
    const existing = await AsyncStorage.getItem(SCHOOLS_KEY);
    if (!existing) {
      await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(SEED_SCHOOLS));
      await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(SEED_CLASSES));
    }
    seedLoaded = true;
  },

  async getSchools(): Promise<School[]> {
    const data = await AsyncStorage.getItem(SCHOOLS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveSchools(schools: School[]): Promise<void> {
    await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
  },

  async getClasses(): Promise<SchoolClass[]> {
    const data = await AsyncStorage.getItem(CLASSES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveClasses(classes: SchoolClass[]): Promise<void> {
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([SCHOOLS_KEY, CLASSES_KEY]);
    seedLoaded = false;
  },

  async restoreSeed(): Promise<void> {
    await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(SEED_SCHOOLS));
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(SEED_CLASSES));
    seedLoaded = true;
  },
};
