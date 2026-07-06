import { expect, test, describe } from "bun:test";
import { reducer } from "./use-toast";

describe("toast reducer", () => {
  const initialState = { toasts: [] };

  test("should handle ADD_TOAST", () => {
    const action = {
      type: "ADD_TOAST" as const,
      toast: { id: "1", title: "Test Toast", open: true }
    };
    const nextState = reducer(initialState, action);
    expect(nextState.toasts.length).toBe(1);
    expect(nextState.toasts[0].id).toBe("1");
    expect(nextState.toasts[0].title).toBe("Test Toast");
  });

  test("should enforce TOAST_LIMIT", () => {
    const state = { toasts: [{ id: "1", open: true }] };
    const action = {
      type: "ADD_TOAST" as const,
      toast: { id: "2", open: true }
    };
    const nextState = reducer(state, action);
    // TOAST_LIMIT is 1 in use-toast.ts
    expect(nextState.toasts.length).toBe(1);
    expect(nextState.toasts[0].id).toBe("2");
  });

  test("should handle UPDATE_TOAST", () => {
    const state = { toasts: [{ id: "1", title: "Old", open: true }] };
    const action = {
      type: "UPDATE_TOAST" as const,
      toast: { id: "1", title: "New" }
    };
    const nextState = reducer(state, action);
    expect(nextState.toasts[0].title).toBe("New");
  });

  test("should handle DISMISS_TOAST", () => {
    const state = { toasts: [{ id: "1", open: true }, { id: "2", open: true }] };
    const action = { type: "DISMISS_TOAST" as const, toastId: "1" };
    const nextState = reducer(state, action);
    expect(nextState.toasts[0].open).toBe(false);
    expect(nextState.toasts[1].open).toBe(true);
  });

  test("should handle DISMISS_TOAST without id", () => {
    const state = { toasts: [{ id: "1", open: true }, { id: "2", open: true }] };
    const action = { type: "DISMISS_TOAST" as const };
    const nextState = reducer(state, action);
    expect(nextState.toasts[0].open).toBe(false);
    expect(nextState.toasts[1].open).toBe(false);
  });

  test("should handle REMOVE_TOAST", () => {
    const state = { toasts: [{ id: "1", open: true }, { id: "2", open: true }] };
    const action = { type: "REMOVE_TOAST" as const, toastId: "1" };
    const nextState = reducer(state, action);
    expect(nextState.toasts.length).toBe(1);
    expect(nextState.toasts[0].id).toBe("2");
  });

  test("should handle REMOVE_TOAST without id", () => {
    const state = { toasts: [{ id: "1", open: true }, { id: "2", open: true }] };
    const action = { type: "REMOVE_TOAST" as const };
    const nextState = reducer(state, action);
    expect(nextState.toasts.length).toBe(0);
  });
});
