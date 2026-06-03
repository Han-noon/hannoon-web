import { create } from 'zustand';

interface SearchStore {
  keyword: string;
  setKeyword: (keyword: string) => void;
  search: boolean;
  setSearch: (search: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: '',
  setKeyword: (keyword) => set({ keyword }),
  search: false,
  setSearch: (search) => set({ search }),
}));
