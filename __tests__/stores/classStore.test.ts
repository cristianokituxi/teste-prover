import { useClassStore } from "@/src/features/classes/store";

jest.mock("@/src/features/classes/repository", () => ({
  ClassRepository: jest.fn().mockImplementation(() => ({
    listBySchool: jest.fn().mockResolvedValue([
      {
        id: "c1",
        schoolId: "s1",
        name: "1A",
        shift: "Morning",
        year: 2026,
        createdAt: "2026-01-01",
      },
    ]),
    create: jest.fn().mockResolvedValue({
      id: "c2",
      schoolId: "s1",
      name: "1B",
      shift: "Afternoon",
      year: 2026,
      createdAt: "2026-01-01",
    }),
    update: jest.fn().mockResolvedValue({
      id: "c1",
      schoolId: "s1",
      name: "1A Mod",
      shift: "Night",
      year: 2027,
      createdAt: "2026-01-01",
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe("useClassStore", () => {
  beforeEach(() => {
    useClassStore.setState({ classesBySchool: {}, isLoading: false, errorMessage: null });
  });

  it("fetches classes for a school", async () => {
    await useClassStore.getState().fetchClasses("s1");
    const state = useClassStore.getState();
    expect(state.classesBySchool["s1"].length).toBe(1);
    expect(state.classesBySchool["s1"][0].name).toBe("1A");
  });

  it("creates a class for a school", async () => {
    await useClassStore.getState().fetchClasses("s1");
    await useClassStore.getState().createClass("s1", {
      name: "1B",
      shift: "Afternoon",
      year: 2026,
    });
    const state = useClassStore.getState();
    expect(state.classesBySchool["s1"].length).toBe(1); // refreshed
  });

  it("deletes a class", async () => {
    await useClassStore.getState().fetchClasses("s1");
    await useClassStore.getState().deleteClass("s1", "c1");
    expect(useClassStore.getState().classesBySchool["s1"].length).toBe(1);
  });
});
