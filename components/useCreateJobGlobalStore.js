import { create } from "zustand";

export const useCreateJobGlobalStore = create((set) => ({
  gid: null,
  type: "",
  title: "",
  description: "",
  selectedSubs: [],
  requirements: [{ id: 1, value: "" }],
  languages: [{ id: 1, lang: "", level: "" }],
  address: "",
  fileData: {
    fileName: null,
    fileUri: null,
    fileType: null,
    fileSize: null,
  },
  selectedTerm: "short",
  selectedOption: "1",
  customDays: "",
  hourlyRate: "",
  totalPrice: "",
  expectedTime: 0,
  processingFee: "",
  isEdit: false,
  editingId: null,
  activeTab: 0,

  isEditingFromReview: false,
  reviewReturnTab: null,

  setEditingFromReview: (tabIndex) =>
    set({
      isEditingFromReview: true,
      reviewReturnTab: tabIndex,
    }),

  clearEditingFromReview: () =>
    set({
      isEditingFromReview: false,
      reviewReturnTab: null,
    }),

  setField: (field, value) => set({ [field]: value }),

  addCategory: (cat) =>
    set((state) => {
      if (state.selectedSubs.some((s) => s.subId === cat.subId)) return state;
      return { selectedSubs: [...state.selectedSubs, cat] };
    }),

  removeCategory: (subId) =>
    set((state) => ({
      selectedSubs: state.selectedSubs.filter((s) => s.subId !== subId),
    })),

  setEditMode: (id) => set({ isEdit: true, editingId: id }),
  resetEditMode: () => set({ isEdit: false, editingId: null }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  reset: () =>
    set({
      gid:null,
      title: "",
      type:"",
      description: "",
      selectedSubs: [],
      requirements: [{ id: 1, value: "" }],
      languages: [{ id: 1, lang: "", level: "" }],
      address: "",
      fileData: {
        fileName: null,
        fileUri: null,
        fileType: null,
        fileSize: null,
      },
      selectedTerm: "short",
      selectedOption: "1",
      customDays: "",
      hourlyRate: "",
      totalPrice: "",
      expectedTime: 0,
      processingFee: "",
      isEdit: false,
      editingId: null,
      isEditingFromReview: false,
      reviewReturnTab: null,
    }),
}));
