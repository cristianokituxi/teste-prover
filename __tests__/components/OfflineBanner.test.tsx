import React from "react";
import { create, act, ReactTestRenderer } from "react-test-renderer";

const mockUseSync = jest.fn();
jest.mock("@/src/shared/hooks/useSync", () => ({ useSync: () => mockUseSync() }));

import { OfflineBanner } from "@/src/shared/components/OfflineBanner";

function r(el: React.ReactElement): string { let t: ReactTestRenderer | undefined; act(() => { t = create(el); }); return JSON.stringify(t!.toJSON()); }

describe("OfflineBanner", () => {
  it("null quando online sem pendentes", () => {
    mockUseSync.mockReturnValue({ isOnline: true, isSyncing: false, pendingCount: 0, syncProgress: 0, syncTotal: 0 });
    const tree = create(<OfflineBanner />).toJSON();
    expect(tree).toBeNull();
  });

  it("mostra offline quando !isOnline", () => {
    mockUseSync.mockReturnValue({ isOnline: false, isSyncing: false, pendingCount: 1, syncProgress: 0, syncTotal: 0 });
    expect(r(<OfflineBanner />)).toContain("Modo offline");
  });

  it("mostra sincronizando quando isSyncing", () => {
    mockUseSync.mockReturnValue({ isOnline: true, isSyncing: true, pendingCount: 2, syncProgress: 1, syncTotal: 2 });
    expect(r(<OfflineBanner />)).toContain("Sincronizando");
  });
});
