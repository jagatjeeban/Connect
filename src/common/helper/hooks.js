/*
  Hooks file
*/

import { useWindowDimensions } from "react-native";
import { useMemo } from "react";

/**
 * Normalizes a numeric input that may be passed as a number, numeric string,
 * or percentage string and returns it as a finite number.
 *
 * @param {number|string} value Input value to validate and normalize.
 * @param {string} inputName Human-readable input label used in the error message.
 * @returns {number} The normalized finite numeric value.
 * @throws {TypeError} Throws when the input cannot be converted to a valid finite number.
 */
const getValidatedNumericValue = (value, inputName) => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const trimmedValue = value.trim();
        const normalizedValue = trimmedValue.endsWith("%")
            ? trimmedValue.slice(0, -1).trim()
            : trimmedValue;

        if (normalizedValue !== "") {
            const parsedValue = Number(normalizedValue);
            if (Number.isFinite(parsedValue)) {
                return parsedValue;
            }
        }
    }

    throw new TypeError(
        `useResponsive expected a number or numeric string for ${inputName}, received ${String(value)}`
    );
};

/**
 * Custom hook for responsive layout across devices
 * @returns 
 */
export const useResponsive = () => {

    const { width, height } = useWindowDimensions();

    const DESIGN_WIDTH = 375;
    const DESIGN_HEIGHT = 812;
    const designWidthDim = Math.min(DESIGN_WIDTH, DESIGN_HEIGHT);
    const designAspectHeight = (16 / 9) * designWidthDim;
    const DESIGN_DIAGONAL = Math.sqrt(designAspectHeight ** 2 + designWidthDim ** 2);

    const rw = (percent) => (width * getValidatedNumericValue(percent, "rw")) / 100;

    const rh = (percent) => (height * getValidatedNumericValue(percent, "rh")) / 100;

    const rf = (percent) => {
        const validatedPercent = getValidatedNumericValue(percent, "rf");
        const widthDimension = Math.min(width, height);
        const aspectHeight = (16 / 9) * widthDimension;
        const diagonal = Math.sqrt(aspectHeight ** 2 + widthDimension ** 2);
        return (diagonal * validatedPercent) / 100;
    };

    const isLandscape = width > height;

    const adaptiveSize = (percent) => {
        if (isLandscape) return rh(percent);
        else return rw(percent);
    }

    const fontSizeToRf = (fontSize) => {
        const validatedFontSize = getValidatedNumericValue(fontSize, "fontSizeToRf");
        const percentage = (validatedFontSize * 100) / DESIGN_DIAGONAL;
        return rf(percentage);
    }

    return {
        width,
        height,
        isLandscape,
        adaptiveSize,
        rw,
        rh,
        rf,
        fontSizeToRf
    };
}

/**
 * Custom hook to search dynamic lists with dynamic search keys
 * @param {Array<Object>} list Original list to search inside
 * @param {string} searchKey Key on value of which the filter operation to be performed (Optional)
 * @param {string} searchText Search input (Optional)
 * @returns {Array<Object>} The required filtered list
 */
export const useSearchFilter = (list, searchKey = '', searchText = '') => {
    return useMemo(() => {
        if (!Array.isArray(list)) return [];

        const originalArr = [...list];
        const input = searchText.trim().toLowerCase();
        const key = searchKey ?? '';

        if (!input || input === '') return originalArr;

        return originalArr.filter((item) => {
            const value = item?.[key];
            if (!value) return false;
            return String(value).toLowerCase().includes(input);
        });
    }, [list, searchKey, searchText]);
}
