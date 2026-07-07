import { create } from "zustand";

import { ClassRepository } from "@/src/features/classes/repository";
import type { SchoolClass, SchoolClassInput } from "@/src/features/classes/types";
import { refreshSchoolClassCounts } from "@/src/shared/store/crossStoreSync";

type ClassState = {
  classesBySchool: Record<string, SchoolClass[]>;
  isLoading: boolean;
  errorMessage: string | null;

  fetchClasses: (schoolId: string) => Promise<void>;
  createClass: (schoolId: string, input: SchoolClassInput) => Promise<void>;
  updateClass: (schoolId: string, classId: string, input: SchoolClassInput) => Promise<void>;
  deleteClass: (schoolId: string, classId: string) => Promise<void>;
  clearError: () => void;
};

const repository = new ClassRepository();

export const useClassStore = create<ClassState>((set, get) => ({
  classesBySchool: {},
  isLoading: false,
  errorMessage: null,

  fetchClasses: async (schoolId) => {
    try {
      set({ isLoading: true, errorMessage: null });
      const classes = await repository.listBySchool(schoolId);
      set({ classesBySchool: { ...get().classesBySchool, [schoolId]: classes } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar turmas.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createClass: async (schoolId, input) => {
    try {
      set({ isLoading: true, errorMessage: null });
      await repository.create(schoolId, input);
      const classes = await repository.listBySchool(schoolId);
      set({ classesBySchool: { ...get().classesBySchool, [schoolId]: classes } });
      refreshSchoolClassCounts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar turma.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateClass: async (schoolId, classId, input) => {
    try {
      set({ isLoading: true, errorMessage: null });
      await repository.update(classId, input);
      const classes = await repository.listBySchool(schoolId);
      set({ classesBySchool: { ...get().classesBySchool, [schoolId]: classes } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar turma.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClass: async (schoolId, classId) => {
    try {
      set({ isLoading: true, errorMessage: null });
      await repository.delete(classId);
      const classes = await repository.listBySchool(schoolId);
      set({ classesBySchool: { ...get().classesBySchool, [schoolId]: classes } });
      refreshSchoolClassCounts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir turma.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ errorMessage: null }),
}));
