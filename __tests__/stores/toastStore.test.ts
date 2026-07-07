import { useToastStore } from "@/src/shared/store/useToastStore";

describe("useToastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("adds a toast", () => {
    useToastStore.getState().showToast("Hello", "success");
    const { toasts } = useToastStore.getState();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe("Hello");
    expect(toasts[0].type).toBe("success");
  });

  it("defaults to info type", () => {
    useToastStore.getState().showToast("Info message");
    expect(useToastStore.getState().toasts[0].type).toBe("info");
  });

  it("removes a toast by id", () => {
    useToastStore.getState().showToast("Toast 1");
    useToastStore.getState().showToast("Toast 2");
    const id = useToastStore.getState().toasts[0].id;
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts.length).toBe(1);
    expect(useToastStore.getState().toasts[0].message).toBe("Toast 2");
  });

  it("generates unique ids", () => {
    useToastStore.getState().showToast("A");
    useToastStore.getState().showToast("B");
    const ids = useToastStore.getState().toasts.map((t) => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });
});
