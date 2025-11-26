import { create } from "zustand";

export const useServiceGlobalStore = create((set) => ({
    title: "",
    description: "",
    hourlyRate: "",
    totalPrice: "",
    expectedTime: 0,
    images: [],
    categories: [],

    setField: (field, value) => set({ [field]: value }),
    setExpectedTime: (hours) => set({ expectedTime: hours }),
    addCategory: (category) =>
        set((state) => {
            if (state.categories.some((c) => c.subId === category.subId)) {
                return state; // prevent duplicates
            }
            return { categories: [...state.categories, category] };
        }),

    removeCategory: (subId) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.subId !== subId),
        })),

    clearCategories: () => set({ categories: [] }),

    // IMAGE FUNCTIONS
    addImage: (img) =>
        set((state) => ({ images: [...state.images, img] })),

    removeImage: (index) =>
        set((state) => ({
            images: state.images.filter((_, i) => i !== index),
        })),

    // RESET EVERYTHING AFTER PUBLISH
    reset: () =>
        set({
            title: "",
            description: "",
            hourlyRate: "",
            totalPrice: "",
            expectedTime: 0,
            images: [],
            categories: [],
        }),
}));
