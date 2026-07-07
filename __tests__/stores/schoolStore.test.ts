import { useSchoolStore } from "@/src/features/schools/store";

// Mock the repository
jest.mock("@/src/features/schools/repository", () => ({
  SchoolRepository: jest.fn().mockImplementation(() => ({
    list: jest.fn().mockResolvedValue([
      { id: "1", name: "Escola A", address: "Rua A", classCount: 2, createdAt: "2026-01-01" },
      { id: "2", name: "Escola B", address: "Rua B", classCount: 0, createdAt: "2026-01-01" },
    ]),
    create: jest.fn().mockResolvedValue({
      id: "3",
      name: "Escola C",
      address: "Rua C",
      classCount: 0,
      createdAt: "2026-01-01",
    }),
    update: jest.fn().mockResolvedValue({
      id: "1",
      name: "Escola X",
      address: "Rua X",
      classCount: 2,
      createdAt: "2026-01-01",
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe("useSchoolStore", () => {
  beforeEach(() => {
    useSchoolStore.setState({ schools: [], isLoading: false, errorMessage: null });
  });

  it("fetches schools and updates state", async () => {
    await useSchoolStore.getState().fetchSchools();
    const state = useSchoolStore.getState();
    expect(state.schools.length).toBe(2);
    expect(state.isLoading).toBe(false);
    expect(state.schools[0].name).toBe("Escola A");
  });

  it("sets isLoading true while fetching", async () => {
    const promise = useSchoolStore.getState().fetchSchools();
    expect(useSchoolStore.getState().isLoading).toBe(true);
    await promise;
    expect(useSchoolStore.getState().isLoading).toBe(false);
  });

  it("creates a school and refreshes list", async () => {
    await useSchoolStore.getState().fetchSchools();
    await useSchoolStore.getState().createSchool({ name: "Nova", address: "Rua Nova" });
    expect(useSchoolStore.getState().schools.length).toBe(2); // refreshed after create
  });

  it("clears error", () => {
    useSchoolStore.setState({ errorMessage: "Erro" });
    useSchoolStore.getState().clearError();
    expect(useSchoolStore.getState().errorMessage).toBeNull();
  });
});
