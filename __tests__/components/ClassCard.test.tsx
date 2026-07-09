import { ClassCard } from "@/src/features/classes/components/ClassCard";
import { create, act } from "react-test-renderer";
import type { SchoolClass } from "@/src/features/classes/types";
import React from "react";
import { ReactTestRenderer } from "react-test-renderer";
function r(el: React.ReactElement) { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t.toJSON()); }
const c: SchoolClass = { id:"c1", schoolId:"s1", name:"1o Ano A", shift:"Morning", year:2026, createdAt:"2026-01-01T00:00:00.000Z" };

describe("ClassCard", () => {
  it("nome e ano", () => {
    const json = r(<ClassCard classItem={c} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(json).toContain("1o Ano A");
  });
  it("Manha", () => expect(r(<ClassCard classItem={c} onEdit={jest.fn()} onDelete={jest.fn()} />)).toContain("Manhã"));
  it("Tarde", () => expect(r(<ClassCard classItem={{...c,shift:"Afternoon"}} onEdit={jest.fn()} onDelete={jest.fn()} />)).toContain("Tarde"));
  it("Noite", () => expect(r(<ClassCard classItem={{...c,shift:"Night"}} onEdit={jest.fn()} onDelete={jest.fn()} />)).toContain("Noite"));
});
