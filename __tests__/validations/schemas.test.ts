import { schoolSchema } from "@/src/features/schools/validation";
import { classSchema } from "@/src/features/classes/validation";

describe("schoolSchema", () => {
  it("accepts valid school data", () => {
    const result = schoolSchema.safeParse({
      name: "Escola Municipal",
      address: "Rua das Flores, 123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = schoolSchema.safeParse({ name: "", address: "Rua X" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("nome");
    }
  });

  it("rejects short name", () => {
    const result = schoolSchema.safeParse({ name: "AB", address: "Rua X, 123 - Centro" });
    expect(result.success).toBe(false);
  });

  it("rejects empty address", () => {
    const result = schoolSchema.safeParse({ name: "Escola X", address: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("endereço");
    }
  });

  it("rejects short address", () => {
    const result = schoolSchema.safeParse({ name: "Escola X", address: "Rua" });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from name and address", () => {
    const result = schoolSchema.safeParse({
      name: "  Escola Teste  ",
      address: "  Rua Teste, 100  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Escola Teste");
      expect(result.data.address).toBe("Rua Teste, 100");
    }
  });
});

describe("classSchema", () => {
  it("accepts valid class data", () => {
    const result = classSchema.safeParse({
      name: "1º Ano A",
      shift: "Morning",
      year: 2026,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid shift", () => {
    const result = classSchema.safeParse({
      name: "1º Ano A",
      shift: "Invalid",
      year: 2026,
    });
    expect(result.success).toBe(false);
  });

  it("rejects year before 2000", () => {
    const result = classSchema.safeParse({
      name: "1º Ano A",
      shift: "Morning",
      year: 1999,
    });
    expect(result.success).toBe(false);
  });

  it("rejects year after 2100", () => {
    const result = classSchema.safeParse({
      name: "1º Ano A",
      shift: "Morning",
      year: 2101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = classSchema.safeParse({
      name: "",
      shift: "Morning",
      year: 2026,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer year", () => {
    const result = classSchema.safeParse({
      name: "1º Ano A",
      shift: "Morning",
      year: 2026.5,
    });
    expect(result.success).toBe(false);
  });
});
