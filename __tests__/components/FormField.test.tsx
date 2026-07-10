import React from "react";
import { FormField } from "@/src/shared/components/FormField";
import { create, act, ReactTestRenderer } from "react-test-renderer";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("FormField", () => {
  it("renderiza label", () => {
    expect(r(<FormField icon="person-outline" label="Usuario"><span /></FormField>)).toContain("Usuario");
  });
  it("renderiza children", () => {
    expect(r(<FormField icon="key-outline" label="Senha"><span>input</span></FormField>)).toContain("input");
  });
});
