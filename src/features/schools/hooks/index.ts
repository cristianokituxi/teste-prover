import { useCallback } from "react";

import { useSchoolStore } from "@/src/features/schools/store";
import type { School, SchoolInput } from "@/src/features/schools/types";

export function useSchools() {
  const schools = useSchoolStore((s) => s.schools);
  const isLoading = useSchoolStore((s) => s.isLoading);
  const errorMessage = useSchoolStore((s) => s.errorMessage);
  const fetchSchools = useSchoolStore((s) => s.fetchSchools);
  const clearError = useSchoolStore((s) => s.clearError);
  return { schools, isLoading, errorMessage, fetchSchools, clearError };
}

export function useCreateSchool() {
  const createSchool = useSchoolStore((s) => s.createSchool);
  const isLoading = useSchoolStore((s) => s.isLoading);
  return useCallback(
    async (input: SchoolInput) => {
      await createSchool(input);
    },
    [createSchool],
  );
}

export function useUpdateSchool() {
  const updateSchool = useSchoolStore((s) => s.updateSchool);
  const isLoading = useSchoolStore((s) => s.isLoading);
  return useCallback(
    async (id: string, input: SchoolInput) => {
      await updateSchool(id, input);
    },
    [updateSchool],
  );
}

export function useDeleteSchool() {
  const deleteSchool = useSchoolStore((s) => s.deleteSchool);
  const isLoading = useSchoolStore((s) => s.isLoading);
  return useCallback(
    async (id: string) => {
      await deleteSchool(id);
    },
    [deleteSchool],
  );
}

export function useSearchSchools(query: string): School[] {
  const schools = useSchoolStore((s) => s.schools);
  const normalized = query.trim().toLowerCase();
  if (!normalized) return schools;
  return schools.filter(
    (s) =>
      s.name.toLowerCase().includes(normalized) || s.address.toLowerCase().includes(normalized),
  );
}
