import { db } from "@/src/shared/services/db";

describe("db (in-memory database)", () => {
  beforeEach(() => {
    // Reset by deleting all and re-adding seed data
    const schools = db.listSchools();
    for (const s of schools) {
      db.deleteSchool(s.id);
    }
    db.createSchool({ name: "Escola A", address: "Rua A" });
    db.createSchool({ name: "Escola B", address: "Rua B" });
  });

  describe("schools", () => {
    it("lists schools with classCount", () => {
      const schools = db.listSchools();
      expect(schools.length).toBe(2);
      expect(schools[0]).toHaveProperty("classCount");
      expect(schools[0].classCount).toBe(0);
    });

    it("creates a school", () => {
      const school = db.createSchool({ name: "Escola C", address: "Rua C" });
      expect(school.name).toBe("Escola C");
      expect(school.classCount).toBe(0);
      expect(db.listSchools().length).toBe(3);
    });

    it("updates a school", () => {
      const [school] = db.listSchools();
      const updated = db.updateSchool(school.id, { name: "Escola X", address: "Rua X" });
      expect(updated?.name).toBe("Escola X");
    });

    it("returns null when updating non-existent school", () => {
      expect(db.updateSchool("fake-id", { name: "X", address: "Y" })).toBeNull();
    });

    it("deletes a school and its classes", () => {
      const [school] = db.listSchools();
      db.createClass(school.id, { name: "Turma 1", shift: "Morning", year: 2026 });
      expect(db.listClasses(school.id).length).toBe(1);
      expect(db.deleteSchool(school.id)).toBe(true);
      expect(db.listClasses(school.id).length).toBe(0);
    });
  });

  describe("classes", () => {
    it("creates and lists classes for a school", () => {
      const [school] = db.listSchools();
      const cls = db.createClass(school.id, { name: "1A", shift: "Morning", year: 2026 });
      expect(cls.name).toBe("1A");
      const classes = db.listClasses(school.id);
      expect(classes.length).toBe(1);
    });

    it("updates a class", () => {
      const [school] = db.listSchools();
      const cls = db.createClass(school.id, { name: "1A", shift: "Morning", year: 2026 });
      const updated = db.updateClass(cls.id, { name: "1B", shift: "Afternoon", year: 2027 });
      expect(updated?.name).toBe("1B");
      expect(updated?.shift).toBe("Afternoon");
    });

    it("deletes a class", () => {
      const [school] = db.listSchools();
      const cls = db.createClass(school.id, { name: "1A", shift: "Morning", year: 2026 });
      expect(db.deleteClass(cls.id)).toBe(true);
      expect(db.listClasses(school.id).length).toBe(0);
    });

    it("returns false when deleting non-existent class", () => {
      expect(db.deleteClass("fake-id")).toBe(false);
    });
  });
});
