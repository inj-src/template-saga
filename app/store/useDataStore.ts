import { create } from "zustand";
import { allDataSets, DataSetKey } from "../dummy-data";

interface DataStore {
  selectedDataKey: DataSetKey;
  selectedData: unknown;
  setSelectedDataKey: (key: DataSetKey) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  selectedDataKey: "bill",
  selectedData: allDataSets["bill"].data,
  setSelectedDataKey: (key) =>
    set({
      selectedDataKey: key,
      selectedData: allDataSets[key].data,
    }),
}));
