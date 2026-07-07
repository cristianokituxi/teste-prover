import { apiClient } from "@/src/shared/services/apiClient";
import type { SchoolClass, SchoolClassInput } from "@/src/features/classes/types";

export class ClassRepository {
  async listBySchool(schoolId: string): Promise<SchoolClass[]> {
    const { data } = await apiClient.get<SchoolClass[]>("/classes", { params: { schoolId } });
    return data;
  }

  async create(schoolId: string, input: SchoolClassInput): Promise<SchoolClass> {
    const { data } = await apiClient.post<SchoolClass>("/classes", { ...input, schoolId });
    return data;
  }

  async update(id: string, input: SchoolClassInput): Promise<SchoolClass> {
    const { data } = await apiClient.put<SchoolClass>(`/classes/${id}`, input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/classes/${id}`);
  }
}
