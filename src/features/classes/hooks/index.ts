import { useCallback } from "react";

import { useClassStore } from "@/src/features/classes/store";
import type { SchoolClass, SchoolClassInput } from "@/src/features/classes/types";

export function useClasses(schoolId: string) {
  const classesBySchool = useClassStore((s) => s.classesBySchool);
  const isLoading = useClassStore((s) => s.isLoading);
  const errorMessage = useClassStore((s) => s.errorMessage);
  const fetchClasses = useClassStore((s) => s.fetchClasses);
  const clearError = useClassStore((s) => s.clearError);
  const classes = classesBySchool[schoolId] ?? [];
  return { classes, isLoading, errorMessage, fetchClasses, clearError };
}

export function useCreateClass() {
  const createClass = useClassStore((s) => s.createClass);
  const isLoading = useClassStore((s) => s.isLoading);
  return useCallback(
    async (schoolId: string, input: SchoolClassInput) => {
      await createClass(schoolId, input);
    },
    [createClass],
  );
}

export function useUpdateClass() {
  const updateClass = useClassStore((s) => s.updateClass);
  const isLoading = useClassStore((s) => s.isLoading);
  return useCallback(
    async (schoolId: string, classId: string, input: SchoolClassInput) => {
      await updateClass(schoolId, classId, input);
    },
    [updateClass],
  );
}

export function useDeleteClass() {
  const deleteClass = useClassStore((s) => s.deleteClass);
  const isLoading = useClassStore((s) => s.isLoading);
  return useCallback(
    async (schoolId: string, classId: string) => {
      await deleteClass(schoolId, classId);
    },
    [deleteClass],
  );
}

export function useSearchClasses(schoolId: string, query: string): SchoolClass[] {
  const classesBySchool = useClassStore((s) => s.classesBySchool);
  const classes = classesBySchool[schoolId] ?? [];
  const normalized = query.trim().toLowerCase();
  if (!normalized) return classes;
  return classes.filter(
    (c) =>
      c.name.toLowerCase().includes(normalized) ||
      c.shift.toLowerCase().includes(normalized),
  );
}
