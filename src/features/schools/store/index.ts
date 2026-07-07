import { create } from "zustand";

import { SchoolRepository } from "@/src/features/schools/repository";
import type { School, SchoolInput } from "@/src/features/schools/types";

type SchoolState = {
  schools: School[];
  isLoading: boolean;
  errorMessage: string | null;

  fetchSchools: () => Promise<void>;
  createSchool: (input: SchoolInput) => Promise<void>;
  updateSchool: (id: string, input: SchoolInput) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  clearError: () => void;
};

const repository = new SchoolRepository();

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  isLoading: false,
  errorMessage: null,

  fetchSchools: async () => {
    try {
      set({ isLoading: true, errorMessage: null });
      const schools = await repository.list();
      set({ schools });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar escolas.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createSchool: async (input) => {
    try {
      set({ isLoading: true, errorMessage: null });
      await repository.create(input);
      const schools = await repository.list();
      set({ schools });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar escola.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSchool: async (id, input) => {
    try {
      set({ isLoading: true, errorMessage: null });
      await repository.update(id, input);
      const schools = await repository.list();
      set({ schools });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar escola.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSchool: async (id) => {
    try {
      set({ isLoading: true, errorMessage: null });
      await repository.delete(id);
      const schools = await repository.list();
      set({ schools });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir escola.";
      set({ errorMessage: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ errorMessage: null }),
}));
