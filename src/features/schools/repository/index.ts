import { apiClient } from "@/src/shared/services/apiClient";
import type { School, SchoolInput } from "@/src/features/schools/types";

export class SchoolRepository {
  async list(): Promise<School[]> {
    const { data } = await apiClient.get<School[]>("/schools");
    return data;
  }

  async getById(id: string): Promise<School> {
    const schools = await this.list();
    const school = schools.find((s) => s.id === id);
    if (!school) throw new Error("Escola não encontrada.");
    return school;
  }

  async create(input: SchoolInput): Promise<School> {
    const { data } = await apiClient.post<School>("/schools", input);
    return data;
  }

  async update(id: string, input: SchoolInput): Promise<School> {
    const { data } = await apiClient.put<School>(`/schools/${id}`, input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/schools/${id}`);
  }
}
