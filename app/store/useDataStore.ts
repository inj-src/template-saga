import { create } from "zustand";
import { allDataSets, type DataSet } from "../dummy-data";

const CUSTOM_DATASETS_KEY = "template-saga-custom-datasets";

interface CustomDataSet {
  label: string;
  data: unknown;
  templateHtml?: string;
}

interface DataStore {
  selectedDataKey: string;
  selectedData: unknown;
  selectedTemplateHtml: string | null;
  customDataSets: Record<string, CustomDataSet>;
  setSelectedDataKey: (key: string) => void;
  addCustomDataSet: (label: string, data: unknown, templateHtml?: string) => string;
  loadCustomDataSets: () => void;
  getAllDataSets: () => Record<string, DataSet>;
  removeCustomDataSet: (key: string) => void;
}

const generateCustomKey = (label: string): string => {
  return `custom-${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
};

const saveToLocalStorage = (customDataSets: Record<string, CustomDataSet>) => {
  try {
    localStorage.setItem(CUSTOM_DATASETS_KEY, JSON.stringify(customDataSets));
  } catch (error) {
    console.error("Failed to save custom datasets to localStorage:", error);
  }
};

const loadFromLocalStorage = (): Record<string, CustomDataSet> => {
  try {
    const stored = localStorage.getItem(CUSTOM_DATASETS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load custom datasets from localStorage:", error);
    return {};
  }
};

export const useDataStore = create<DataStore>((set, get) => ({
  selectedDataKey: "bill",
  selectedData: allDataSets["bill"].data,
  selectedTemplateHtml: allDataSets["bill"].templateHtml ?? null,
  customDataSets: {},

  setSelectedDataKey: (key: string) => {
    const { customDataSets } = get();
    const allSets = { ...allDataSets, ...customDataSets };
    const selectedSet = allSets[key as keyof typeof allSets];
    if (selectedSet) {
      set({
        selectedDataKey: key,
        selectedData: selectedSet.data,
        selectedTemplateHtml: selectedSet.templateHtml ?? null,
      });
    }
  },

  addCustomDataSet: (label: string, data: unknown, templateHtml?: string) => {
    const key = generateCustomKey(label);
    set((state) => {
      const newCustomDataSets = {
        ...state.customDataSets,
        [key]: { label, data, templateHtml },
      };
      saveToLocalStorage(newCustomDataSets);
      return {
        customDataSets: newCustomDataSets,
        selectedDataKey: key,
        selectedData: data,
        selectedTemplateHtml: templateHtml ?? null,
      };
    });
    return key;
  },

  loadCustomDataSets: () => {
    const customDataSets = loadFromLocalStorage();
    set({ customDataSets });
  },

  getAllDataSets: () => {
    const { customDataSets } = get();
    return { ...allDataSets, ...customDataSets };
  },

  removeCustomDataSet: (key: string) => {
    set((state) => {
      const newCustomDataSets = { ...state.customDataSets };
      delete newCustomDataSets[key];
      saveToLocalStorage(newCustomDataSets);

      // If the removed dataset was selected, switch to default
      const newState: Partial<DataStore> = { customDataSets: newCustomDataSets };
      if (state.selectedDataKey === key) {
        newState.selectedDataKey = "bill";
        newState.selectedData = allDataSets["bill"].data;
        newState.selectedTemplateHtml = allDataSets["bill"].templateHtml ?? null;
      }
      return newState as DataStore;
    });
  },
}));
