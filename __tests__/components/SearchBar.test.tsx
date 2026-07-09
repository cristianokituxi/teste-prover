import { SearchBar } from "@/src/shared/components/SearchBar";
import { create, act } from "react-test-renderer";
function r(el: any) { let t: any; act(() => { t = create(el); }); return JSON.stringify(t.toJSON()); }

describe("SearchBar", () => {
  it("placeholder", () => expect(r(<SearchBar value="" onChangeText={jest.fn()} placeholder="Buscar..." />)).toContain("Buscar..."));
  it("valor input", () => expect(r(<SearchBar value="escola" onChangeText={jest.fn()} placeholder="X" />)).toContain("escola"));
  it("Limpar visivel", () => expect(r(<SearchBar value="x" onChangeText={jest.fn()} placeholder="X" onClear={jest.fn()} />)).toContain("Limpar"));
  it("Limpar oculto", () => expect(r(<SearchBar value="" onChangeText={jest.fn()} placeholder="X" onClear={jest.fn()} />)).not.toContain("Limpar"));
});
