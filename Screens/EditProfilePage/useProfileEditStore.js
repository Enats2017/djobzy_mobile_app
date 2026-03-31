import { create } from "zustand";

export const useProfileEditStore = create((set) => ({
    draft: {
        basicInfo: {},
        category: [],
        languages: [],
        education: [],
        assets: [],
        vehicles: [],
        certificates: [],
        licenses: [],
        // add all modules here
    },

    setDraftField: (field, value) =>
        set((state) => ({
            draft: {
                ...state.draft,
                [field]: value,
            },
        })),

    resetDraft: (initialData) =>
        set({
            draft: initialData,
        }),
}));