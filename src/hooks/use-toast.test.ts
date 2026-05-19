
import { expect, test, describe } from "bun:test";
import { reducer, actionTypes, TOAST_LIMIT, type State, type ToasterToast } from "./use-toast";

describe("toast reducer", () => {
  const initialState: State = { toasts: [] };

  describe("ADD_TOAST", () => {
    test("should add a toast to the state", () => {
      const toast: ToasterToast = { id: "1", title: "Test Toast", open: true };
      const action = { type: actionTypes.ADD_TOAST, toast };

      const newState = reducer(initialState, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });

    test("should respect TOAST_LIMIT", () => {
      const toast1: ToasterToast = { id: "1", title: "Toast 1" };
      const toast2: ToasterToast = { id: "2", title: "Toast 2" };

      let state = reducer(initialState, { type: actionTypes.ADD_TOAST, toast: toast1 });
      state = reducer(state, { type: actionTypes.ADD_TOAST, toast: toast2 });

      expect(state.toasts).toHaveLength(TOAST_LIMIT);
      expect(state.toasts[0]).toEqual(toast2); // Newest should be first and stay
    });
  });

  describe("UPDATE_TOAST", () => {
    test("should update an existing toast", () => {
      const toast: ToasterToast = { id: "1", title: "Old Title" };
      const state = { toasts: [toast] };

      const updatedToast = { id: "1", title: "New Title" };
      const action = { type: actionTypes.UPDATE_TOAST, toast: updatedToast };

      const newState = reducer(state, action);

      expect(newState.toasts[0].title).toBe("New Title");
    });

    test("should not update if ID does not match", () => {
      const toast: ToasterToast = { id: "1", title: "Title" };
      const state = { toasts: [toast] };

      const action = { type: actionTypes.UPDATE_TOAST, toast: { id: "2", title: "New Title" } };

      const newState = reducer(state, action);

      expect(newState.toasts[0].title).toBe("Title");
    });
  });

  describe("DISMISS_TOAST", () => {
    test("should set open: false for a specific toast", () => {
      const toast: ToasterToast = { id: "1", title: "Toast", open: true };
      const state = { toasts: [toast] };

      const action = { type: actionTypes.DISMISS_TOAST, toastId: "1" };
      const newState = reducer(state, action);

      expect(newState.toasts[0].open).toBe(false);
    });

    test("should set open: false for all toasts if no toastId provided", () => {
      const state = {
        toasts: [
          { id: "1", title: "Toast 1", open: true },
          { id: "2", title: "Toast 2", open: true },
        ]
      };

      const action = { type: actionTypes.DISMISS_TOAST };
      const newState = reducer(state, action);

      expect(newState.toasts[0].open).toBe(false);
      expect(newState.toasts[1].open).toBe(false);
    });

  });

  describe("REMOVE_TOAST", () => {
    test("should remove a specific toast by ID", () => {
      const state = {
        toasts: [
          { id: "1", title: "Toast 1" },
          { id: "2", title: "Toast 2" },
        ]
      };

      const action = { type: actionTypes.REMOVE_TOAST, toastId: "1" };
      const newState = reducer(state, action);

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe("2");
    });

    test("should remove all toasts if no toastId provided", () => {
      const state = {
        toasts: [
          { id: "1", title: "Toast 1" },
          { id: "2", title: "Toast 2" },
        ]
      };

      const action = { type: actionTypes.REMOVE_TOAST };
      const newState = reducer(state, action);

      expect(newState.toasts).toHaveLength(0);
    });
  });
});
