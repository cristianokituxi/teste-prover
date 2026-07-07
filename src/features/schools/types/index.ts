export type Shift = "Morning" | "Afternoon" | "Night";

export const SHIFT_LABELS: Record<Shift, string> = {
  Morning: "Manhã",
  Afternoon: "Tarde",
  Night: "Noite",
};

export type School = {
  id: string;
  name: string;
  address: string;
  classCount: number;
  createdAt: string;
};

export type SchoolInput = {
  name: string;
  address: string;
};

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
