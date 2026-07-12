import { useMemo } from "react";

/**
 * Custom hook to search dynamic lists with dynamic search keys
 * @param {Array<Object>} list Original list to search inside
 * @param {string} searchKey Key on value of which the filter operation to be performed (Optional)
 * @param {string} searchText Search input (Optional)
 * @returns {Array<Object>} The required filtered list
 */
export const useSearchFilter = (
  list: Array<object>,
  searchKey: string = "",
  searchText: string = "",
): Array<object> => {
  return useMemo(() => {
    if (!Array.isArray(list)) return [];

    const originalArr = [...list];
    const input = searchText.trim().toLowerCase();
    const key: string = searchKey ?? "";

    if (!input || input === "") return originalArr;

    return originalArr.filter((item: any) => {
      const value = item?.[key];
      if (!value) return false;
      return String(value).toLowerCase().includes(input);
    });
  }, [list, searchKey, searchText]);
};
