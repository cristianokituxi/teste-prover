import { SchoolCard } from "@/src/features/schools/components/SchoolCard";
import { create, act } from "react-test-renderer";
import type { School } from "@/src/features/schools/types";
function r(el: any) { let t: any; act(() => { t = create(el); }); return JSON.stringify(t.toJSON()); }
const s: School = { id:"s1", name:"Escola Municipal Monteiro Lobato", address:"Rua das Acacias, 450", classCount:3, createdAt:"2026-01-01T00:00:00.000Z" };

describe("SchoolCard", () => {
  it("nome e endereco", () => {
    const json = r(<SchoolCard school={s} onPress={jest.fn()} onClassesPress={jest.fn()} />);
    expect(json).toContain("Escola Municipal Monteiro Lobato");
    expect(json).toContain("Rua das Acacias, 450");
  });
  it("ativa quando tem turmas", () => expect(r(<SchoolCard school={s} onPress={jest.fn()} onClassesPress={jest.fn()} />)).toContain("Ativa"));
  it("sem turmas quando zero", () => expect(r(<SchoolCard school={{...s,classCount:0}} onPress={jest.fn()} onClassesPress={jest.fn()} />)).toContain("Sem turmas"));
  it("botao gerenciar", () => expect(r(<SchoolCard school={s} onPress={jest.fn()} onClassesPress={jest.fn()} />)).toContain("Gerenciar turmas"));
});
