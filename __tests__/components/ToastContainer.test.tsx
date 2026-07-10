import React from "react";
import { create, act, ReactTestRenderer } from "react-test-renderer";

jest.mock("@/src/shared/store/useToastStore", () => ({
  useToastStore: (selector: (s: { toasts: { id: string; message: string; type: string }[]; removeToast: (id: string) => void }) => unknown) =>
    selector({
      toasts: [
        { id: "t1", message: "Sucesso!", type: "success" },
        { id: "t2", message: "Erro!", type: "error" },
      ],
      removeToast: jest.fn(),
    }),
}));

import { ToastContainer } from "@/src/shared/components/ToastContainer";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("ToastContainer", () => {
  it("renderiza toasts", () => {
    const json = r(<ToastContainer />);
    expect(json).toContain("Sucesso!");
    expect(json).toContain("Erro!");
  });
});
