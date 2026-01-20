import { create } from "zustand";

export const useGlobalSearch = create((set) => ({
  keyword: "",
  categories: [],
  setKeyword: (value) => set({ keyword: value }),
  clearKeyword: () => set({ keyword: "" }),

  setField: (field, value) => set({ [field]: value }),
  addCategory: (category) =>
    set((state) => {
      if (state.categories.some((c) => c.subId === category.subId)) {
        return state;
      }
      return { categories: [...state.categories, category] };
    }),
  removeCategory: (subId) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.subId !== subId),
    })),

  clearCategories: () => set({ categories: [] }),

  reset: () =>
    set({
      keyword: "",
      categories: [],
    }),
}));
