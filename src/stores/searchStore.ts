import { create } from "zustand";

type SearchStore = {
  keyword: string;
  recentSearches: string[];
  setKeyword: (keyword: string) => void;
  addRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: "",
  recentSearches:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("recentSearches") || "[]")
      : [],
  setKeyword: (keyword) => set({ keyword }),
  addRecentSearch: (keyword) =>
    set((state) => {
      const newList = [
        keyword,
        ...state.recentSearches.filter((k) => k !== keyword),
      ].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(newList));
      return { recentSearches: newList };
    }),
  clearRecentSearches: () => {
    localStorage.removeItem("recentSearches");
    set({ recentSearches: [] });
  },
}));
