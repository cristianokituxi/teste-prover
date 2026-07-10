import { MetricCard } from "@/src/shared/components/MetricCard";
import { create, act } from "react-test-renderer";
import React from "react";
import { ReactTestRenderer } from "react-test-renderer";
function r(el: React.ReactElement) { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("MetricCard", () => {
  it("dados", () => {
    const json = r(<MetricCard iconName="people-outline" iconColor="#1d4ed8" badgeText="Ativos" badgeTextColor="$blue700" label="Total" value={42} />);
    expect(json).toContain("Total");
    expect(json).toContain("42");
    expect(json).toContain("Ativos");
  });
  it("string", () => expect(r(<MetricCard iconName="school-outline" iconColor="#000" badgeText="X" badgeTextColor="$blue700" label="Escolas" value="N/A" />)).toContain("N/A"));
});
