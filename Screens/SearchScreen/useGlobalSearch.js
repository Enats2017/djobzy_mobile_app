import { create } from "zustand";

export const useGlobalSearch = create((set, get) => ({
  keyword: "",
  userSearchMode: 0,
  categories: [],
  low_price: 0,
  high_price: 9999,
  latitude: "",
  longitude: "",
  radius: 0,
  isRemoteJob: 0,
  address: '',
  sortBy: "Distance",
  sortOrder: "ASC",
  searchSort: null,
  searchFilter: null,
  showSearchDropdown: false,
  searchTrigger: 0,
  setSearchSort: (value) =>
    set((state) => ({
      searchSort: value,
      orderBy: value,
      searchFilter: state.searchFilter ?? "Ascending",
      sortOrder: state.searchFilter
        ? state.sortOrder
        : "ASC",

      showSearchDropdown: true,
    })),
  setSearchFilter: (value) =>
    set({
      searchFilter: value,
      sortOrder: value === "Ascending" ? "ASC" : "DESC",
      showSearchDropdown: true,
    }),
  hideSearchDropdown: () => set({ showSearchDropdown: false }),

  triggerSearch: () => set((state) => ({ searchTrigger: state.searchTrigger + 1 })),
  setKeyword: (value) => set({ keyword: value }),
  setUserSearchMode: (value) => set({ userSearchMode: value }),
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

  getSubcategoryParam: () =>
    get()
      .categories.map((c) => c.subId)
      .join(","),

  getCategoryParam: () =>
    get()
      .categories.map((c) => c.name)
      .join(","),

  reset: () =>
    set({
      keyword: "",
      userSearchMode: 0,
      categories: [],
      low_price: 0,
      high_price: 9999,
      latitude: "",
      longitude: "",
      radius: 0,
      isRemoteJob: 0,
      address: "",
      sortBy: "Distance",
      sortOrder: "ASC",
      searchSort: null,
      searchFilter: null,
      showSearchDropdown: false,
      searchTrigger: 0,
    }),
}));
