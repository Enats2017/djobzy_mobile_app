import { create } from "zustand";

export const useCategoryGlobalStore = create((set) => ({
  categories: [],
  editType: null,

  addCategoryFromModal: (category) =>
    set((state) => {
      const exists = state.categories.some(
        (c) => c.subId === category.subId
      );
      if (exists) return state;
      return { categories: [...state.categories, category] };
    }),

  removeCategoryFromModal: (subId) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.subId !== subId),
    })),

  setCategories: (categories) => set({ categories }),

  setEditType: (type) => set({ editType: type }),

  reset: () => set({ categories: [], editType: null }),
}));
