export type Shift = "Morning" | "Afternoon" | "Night";

export type SchoolClass = {
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  year: number;
  createdAt: string;
};

export type SchoolClassInput = {
  name: string;
  shift: Shift;
  year: number;
};
