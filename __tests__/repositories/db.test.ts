import { db } from "@/src/shared/services/db";

describe("db (AsyncStorage database)", () => {
  beforeEach(async () => {
    await db.init();
    const schools = await db.listSchools();
    for (const s of schools) {
      await db.deleteSchool(s.id);
    }
    await db.createSchool({ name: "Escola A", address: "Rua A" });
    await db.createSchool({ name: "Escola B", address: "Rua B" });
  });

  describe("schools", () => {
    it("lists schools with classCount", async () => {
      const schools = await db.listSchools();
      expect(schools.length).toBe(2);
      expect(schools[0]).toHaveProperty("classCount");
      expect(schools[0].classCount).toBe(0);
    });

    it("creates a school", async () => {
      const school = await db.createSchool({ name: "Escola C", address: "Rua C" });
      expect(school.name).toBe("Escola C");
      expect(school.classCount).toBe(0);
      const schools = await db.listSchools();
      expect(schools.length).toBe(3);
    });

    it("updates a school", async () => {
      const schools = await db.listSchools();
      const updated = await db.updateSchool(schools[0].id, { name: "Escola X", address: "Rua X" });
      expect(updated?.name).toBe("Escola X");
    });

    it("returns null when updating non-existent school", async () => {
      const result = await db.updateSchool("fake-id", { name: "X", address: "Y" });
      expect(result).toBeNull();
    });

    it("deletes a school and its classes", async () => {
      const schools = await db.listSchools();
      await db.createClass(schools[0].id, { name: "Turma 1", shift: "Morning", year: 2026 });
      const classes = await db.listClasses(schools[0].id);
      expect(classes.length).toBe(1);
      expect(await db.deleteSchool(schools[0].id)).toBe(true);
      const after = await db.listClasses(schools[0].id);
      expect(after.length).toBe(0);
    });
  });

  describe("classes", () => {
    it("creates and lists classes for a school", async () => {
      const schools = await db.listSchools();
      const cls = await db.createClass(schools[0].id, { name: "1A", shift: "Morning", year: 2026 });
      expect(cls.name).toBe("1A");
      const classes = await db.listClasses(schools[0].id);
      expect(classes.length).toBe(1);
    });

    it("updates a class", async () => {
      const schools = await db.listSchools();
      const cls = await db.createClass(schools[0].id, { name: "1A", shift: "Morning", year: 2026 });
      const updated = await db.updateClass(cls.id, { name: "1B", shift: "Afternoon", year: 2027 });
      expect(updated?.name).toBe("1B");
      expect(updated?.shift).toBe("Afternoon");
    });

    it("deletes a class", async () => {
      const schools = await db.listSchools();
      const cls = await db.createClass(schools[0].id, { name: "1A", shift: "Morning", year: 2026 });
      expect(await db.deleteClass(cls.id)).toBe(true);
      const classes = await db.listClasses(schools[0].id);
      expect(classes.length).toBe(0);
    });

    it("returns false when deleting non-existent class", async () => {
      expect(await db.deleteClass("fake-id")).toBe(false);
    });
  });
});
