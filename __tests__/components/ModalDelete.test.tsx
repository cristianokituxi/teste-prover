import { ModalDelete } from "@/src/shared/components/ModalDelete";
import { create, act } from "react-test-renderer";
function r(el: any) { let t: any; act(() => { t = create(el); }); return JSON.stringify(t.toJSON()); }
function n(el: any) { let t: any; act(() => { t = create(el); }); return t.toJSON(); }

describe("ModalDelete", () => {
  it("aberto", () => {
    const json = r(<ModalDelete isOpen={true} title="Excluir item" message="Deseja remover?" onConfirm={jest.fn()} onCancel={jest.fn()} />);
    expect(json).toContain("Excluir item");
    expect(json).toContain("Deseja remover?");
    expect(json).toContain("Cancelar");
    expect(json).toContain("Excluir");
  });
  it("fechado null", () => expect(n(<ModalDelete isOpen={false} title="X" message="Y" onConfirm={jest.fn()} onCancel={jest.fn()} />)).toBeNull());
  it("loading", () => expect(r(<ModalDelete isOpen={true} title="X" message="Y" onConfirm={jest.fn()} onCancel={jest.fn()} isLoading={true} />)).toContain("Excluindo..."));
});
