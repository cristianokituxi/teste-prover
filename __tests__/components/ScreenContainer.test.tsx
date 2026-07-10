import React from "react";
import { ScreenContainer } from "@/src/shared/components/ScreenContainer";
import { create, act, ReactTestRenderer } from "react-test-renderer";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("ScreenContainer", () => {
  it("renderiza children", () => {
    expect(r(<ScreenContainer><span>conteudo</span></ScreenContainer>)).toContain("conteudo");
  });
});
