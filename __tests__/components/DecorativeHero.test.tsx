import React from "react";
import { DecorativeHero } from "@/src/shared/components/DecorativeHero";
import { create, act, ReactTestRenderer } from "react-test-renderer";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("DecorativeHero", () => {
  it("renderiza children", () => {
    expect(r(<DecorativeHero><div>Conteudo</div></DecorativeHero>)).toContain("Conteudo");
  });
});
