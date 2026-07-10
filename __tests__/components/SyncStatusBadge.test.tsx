import React from "react";
import { SyncStatusBadge } from "@/src/shared/components/SyncStatusBadge";
import type { SyncStatus } from "@/src/shared/components/SyncStatusBadge";
import { create, act, ReactTestRenderer } from "react-test-renderer";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("SyncStatusBadge", () => {
  it("pending", () => expect(r(<SyncStatusBadge status="pending" />)).toContain("Pendente"));
  it("syncing", () => expect(r(<SyncStatusBadge status="syncing" />)).toContain("Sincronizando"));
  it("synced", () => expect(r(<SyncStatusBadge status="synced" />)).toContain("Sincronizado"));
  it("error", () => expect(r(<SyncStatusBadge status="error" />)).toContain("Erro"));
  it("children sobrescreve label", () => expect(r(<SyncStatusBadge status="pending">Custom</SyncStatusBadge>)).toContain("Custom"));
});
