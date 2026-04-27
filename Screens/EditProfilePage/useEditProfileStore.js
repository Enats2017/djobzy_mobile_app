import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    profile: null,
    deleted: {
        languages: [],
        education: [],
        assets: [],
        vehicles: [],
        licenses: [],
        certificates: [],
        experiences: [],
        attachments: [],
    },
    form: {
        userAdmin: 0,
        dob: '',
        years: 0,
        ageShowStatus: 1,
        moneyShowStatus: 1,
        jobCount: '',
        moneySpent: '',
        moneyEarned: '',
        profileTitle: "",
        description: "",
        category: [],
        deletedCategories: [],
        promote: [],
        deletedPromote: [],
        languages: [],
        education: [],
        assets: [],
        vehicles: [],
        certificates: [],
        licenses: [],
        experiences: [],
        photoUri: null,
        attachments: [],
    }
};

export const useEditProfileStore = create(
    persist(
        (set) => ({
            ...initialState,

            setPhotoUri: (uri) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        photoUri: uri,
                    },
                })),

            setField: (field, value) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        [field]: value,
                    },
                })),

            deleteItem: (section, item, index) =>
                set((state) => {
                    const updated = [...state.form[section]];
                    updated.splice(index, 1);

                    const newState = {
                        form: {
                            ...state.form,
                            [section]: updated,
                        },
                    };

                    // ✅ only track if item exists in DB
                    if (item?.id) {
                        newState.deleted = {
                            ...state.deleted,
                            [section]: [
                                ...(state.deleted?.[section] || []),
                                item.id,
                            ],
                        };
                    }

                    return newState;
                }),

            resetStore: async () => {
                set(initialState);
                await AsyncStorage.removeItem("edit-profile-storage");
            },

            setAllData: (data) =>
                set((state) => ({
                    ...state,
                    deleted: initialState.deleted,
                    form: {
                        ...state.form,
                        ...data,
                    },
                })),
        }),
        {
            name: "edit-profile-storage",
            version: 2,
            storage: createJSONStorage(() => AsyncStorage),

            migrate: (persistedState) => {
                if (!persistedState) return initialState;

                return {
                    ...persistedState,
                    deleted: {
                        ...initialState.deleted,
                        ...(persistedState.deleted || {}),
                    },
                    form: {
                        ...initialState.form,   // adds ALL new fields automatically
                        ...persistedState.form, // keeps old values
                    },
                };
            }
        }
    )
);