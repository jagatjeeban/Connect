jest.mock("react-native-share", () => ({
  open: jest.fn(),
}));

jest.mock("react-native-base64", () => ({
  encode: jest.fn(),
}));

jest.mock("react-native-flash-message", () => ({
  showMessage: jest.fn(),
}));

import { buildAlphabetizedContactsList } from "../src/common/helper/commonFun";

describe("buildAlphabetizedContactsList", () => {
  it("sorts contacts into a flat list with sticky header indices", () => {
    const contacts = [
      { recordID: "3", displayName: "Paul", thumbnailPath: "" },
      { recordID: "2", displayName: "Aaron", thumbnailPath: "" },
      { recordID: "4", displayName: "Bella", thumbnailPath: "" },
      { recordID: "1", displayName: "Alice", thumbnailPath: "" },
    ];

    const {
      listItems,
      stickyHeaderIndices,
      scrubberLetters,
      letterToHeaderIndex,
    } = buildAlphabetizedContactsList(contacts);

    expect(stickyHeaderIndices).toEqual([0, 3, 5]);
    expect(scrubberLetters).toEqual(["A", "B", "P"]);
    expect(letterToHeaderIndex).toEqual({
      A: 0,
      B: 3,
      P: 5,
    });
    expect(
      listItems.map((item) =>
        item.type === "header"
          ? `header:${item.letter}`
          : `contact:${item.contact.displayName}`
      )
    ).toEqual([
      "header:A",
      "contact:Aaron",
      "contact:Alice",
      "header:B",
      "contact:Bella",
      "header:P",
      "contact:Paul",
    ]);
  });

  it("keeps a single sticky header for one contact section", () => {
    const contacts = [
      { recordID: "8", displayName: "Quincy", thumbnailPath: "" },
      { recordID: "7", displayName: "Queen", thumbnailPath: "" },
    ];

    const {
      listItems,
      stickyHeaderIndices,
      scrubberLetters,
      letterToHeaderIndex,
    } = buildAlphabetizedContactsList(contacts);

    expect(stickyHeaderIndices).toEqual([0]);
    expect(scrubberLetters).toEqual(["Q"]);
    expect(letterToHeaderIndex).toEqual({
      Q: 0,
    });
    expect(listItems[0]).toMatchObject({
      type: "header",
      letter: "Q",
    });
    expect(listItems.slice(1).map((item) => item.contact.displayName)).toEqual([
      "Queen",
      "Quincy",
    ]);
  });

  it("builds scrubber metadata for filtered multi-section results", () => {
    const contacts = [
      { recordID: "11", displayName: "Ria", thumbnailPath: "" },
      { recordID: "10", displayName: "Raven", thumbnailPath: "" },
      { recordID: "12", displayName: "Sam", thumbnailPath: "" },
    ];

    const { stickyHeaderIndices, scrubberLetters, letterToHeaderIndex } =
      buildAlphabetizedContactsList(contacts);

    expect(stickyHeaderIndices).toEqual([0, 3]);
    expect(scrubberLetters).toEqual(["R", "S"]);
    expect(letterToHeaderIndex).toEqual({
      R: 0,
      S: 3,
    });
  });
});
