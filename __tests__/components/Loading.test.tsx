import React from "react";
import { Loading, Skeleton } from "@/src/shared/components/Loading";
import { create, act, ReactTestRenderer } from "react-test-renderer";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("Loading", () => {
  it("renderiza spinner", () => {
    const json = r(<Loading />);
    expect(json).toContain("View");
  });
});

describe("Skeleton", () => {
  it("renderiza 3 boxes", () => {
    const json = r(<Skeleton />);
    const parsed = JSON.parse(json);
    expect(parsed.children).toHaveLength(3);
  });
});
