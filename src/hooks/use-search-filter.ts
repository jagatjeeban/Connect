import { useMemo } from 'react';

/**
 * Filters a typed list by the string representation of a selected property.
 *
 * @param list - Original list to search.
 * @param searchKey - Property whose value should be searched.
 * @param searchText - Case-insensitive search input.
 * @returns A filtered copy of the original list.
 */
export const useSearchFilter = <Item extends object>(
  list: readonly Item[],
  searchKey: keyof Item,
  searchText = '',
): Item[] => {
  return useMemo(() => {
    const originalArr = [...list];
    const input = searchText.trim().toLowerCase();

    if (!input) return originalArr;

    return originalArr.filter((item) => {
      const value = item[searchKey];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(input);
    });
  }, [list, searchKey, searchText]);
};
