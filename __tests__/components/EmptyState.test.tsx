import { EmptyState } from "@/src/shared/components/EmptyState";
import { create, act } from "react-test-renderer";

function render(el: any) { let t: any; act(() => { t = create(el); }); return { json: () => JSON.stringify(t.toJSON()) }; }

describe("EmptyState", () => {
  it("titulo e mensagem", () => expect(render(<EmptyState title="Vazio" message="Nada aqui" />).json()).toContain("Vazio"));
  it("botao com actionLabel", () => expect(render(<EmptyState title="Vazio" message="Nada aqui" actionLabel="Criar" onAction={jest.fn()} />).json()).toContain("Criar"));
  it("sem botao sem actionLabel", () => expect(render(<EmptyState title="Vazio" message="Nada aqui" />).json()).not.toContain("Criar"));
});
