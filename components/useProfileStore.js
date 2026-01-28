import { create } from "zustand";

export const useProfileStore = create((set) => ({
  
  categories: [],      
  employeeCategories: [],
  employerCategories: [],
  editType: 0,  
   
  setEditType: (type) => set({ editType: type }),

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
      categories: [],
      editType: 0,
    }),
}));
