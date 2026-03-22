import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FastImage from "react-native-fast-image";
import { FlashList } from "@shopify/flash-list";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//import constants
import { Colors, FontFamily } from "../common/constants";

//import custom functions
import { getUcFirstLetter } from "../common/helper/customFun";

//import common functions
import { buildAlphabetizedContactsList } from "../common/helper/commonFun";

//import svg files
import SvgCheck from "../assets/icons/svg/check.svg";
import SvgContacts from "../assets/icons/svg/contacts.svg";
import SvgSearch from "../assets/icons/svg/search.svg";
import AlphabetScrubber from "./AlphabetScrubber";

//import helper hooks
import { useResponsive } from "../common/helper/hooks";

const SCRUBBER_CONTENT_GUTTER = 60;
const SCRUBBER_PREVIEW_GAP = 8;
const SCRUBBER_PREVIEW_HIDDEN_STYLE = { opacity: 0 };
const SCRUBBER_HAPTIC_OPTIONS = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: false,
};

const getNearestScrubberLetter = (locationY, letters, letterLayouts) => {
  let closestLetter = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < letters.length; index += 1) {
    const letter = letters[index];
    const layout = letterLayouts?.[letter];

    if (!layout) {
      continue;
    }

    const centerY = layout.y + layout.height / 2;
    const nextDistance = Math.abs(locationY - centerY);

    if (nextDistance < closestDistance) {
      closestDistance = nextDistance;
      closestLetter = letter;
    }
  }

  return closestLetter;
};

//contact item component
const ContactItem = ({
  item,
  isSelectEvent,
  isSelected = false,
  onClickEvent,
  hasScrubber = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onClickEvent?.(item)}
      style={[
        styles.contactItemContainer,
        hasScrubber && styles.contactItemContainerWithScrubber,
      ]}
    >
      <View style={styles.contactItemLeft}>
        {item?.thumbnailPath !== "" ? (
          <FastImage
            source={{ uri: item?.thumbnailPath, priority: "high" }}
            style={styles.contactImg}
          />
        ) : (
          <View style={styles.defaultContactImg}>
            <Text style={styles.contactFirstLetter}>
              {getUcFirstLetter(item?.displayName)}
            </Text>
          </View>
        )}
        <Text style={styles.contactNameText}>{item?.displayName}</Text>
      </View>
      {isSelectEvent &&
        (!isSelected ? (
          <View style={styles.checkBtn} />
        ) : (
          <View style={styles.checkedBtn}>
            <SvgCheck width={13} height={13} />
          </View>
        ))}
    </TouchableOpacity>
  );
};

const ContactSectionHeader = ({
  letter,
  isSticky = false,
  hasScrubber = false,
}) => {
  return (
    <View
      style={[
        styles.contactInitialContainer,
        hasScrubber && styles.contactInitialContainerWithScrubber,
        isSticky && styles.contactInitialContainerSticky,
      ]}
    >
      <Text style={styles.contactInitialText}>{letter}</Text>
    </View>
  );
};

const renderContactListItem = (
  { item, target },
  { isSelectEvent, selectedContactIds, onClickContact, hasScrubber }
) => {
  if (item?.type === "header") {
    return (
      <ContactSectionHeader
        letter={item?.letter}
        isSticky={target === "StickyHeader"}
        hasScrubber={hasScrubber}
      />
    );
  }

  if (item?.type !== "contact") {
    return null;
  }

  return (
    <ContactItem
      item={item?.contact}
      isSelectEvent={isSelectEvent}
      isSelected={Boolean(selectedContactIds?.has(item?.contact?.recordID))}
      onClickEvent={onClickContact}
      hasScrubber={hasScrubber}
    />
  );
};

const EmptyState = ({ isSearchResultState = false }) => {
  const title = isSearchResultState ? "No results found" : "No contacts yet";
  const description = isSearchResultState
    ? "Try a different name or clear your search to see all contacts."
    : "Your saved contacts will show up here once they are available.";

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconWrapper}>
        {isSearchResultState ? (
          <SvgSearch width={34} height={34} />
        ) : (
          <SvgContacts width={28} height={34} />
        )}
      </View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
    </View>
  );
};

const ContactsList = ({
  contacts = [],
  loaderStatus = false,
  isSelectEvent = false,
  selectedContactIds = null,
  selectionVersion = 0,
  onClickContact,
  searchText = "",
  totalContactsCount = contacts.length,
  style = {},
}) => {
  //hooks
  const { width, height } = useResponsive();
  const insets = useSafeAreaInsets();

  //refs
  const flashListRef = useRef(null);
  const scrubberRailRef = useRef(null);
  const scrubberLetterLookupRef = useRef(new Set());
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 1,
  }).current;
  const lastScrubbedLetterRef = useRef(null);

  //states
  const [activeSectionLetter, setActiveSectionLetter] = useState(null);
  const [activeScrubLetter, setActiveScrubLetter] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubberRailLayout, setScrubberRailLayout] = useState(null);
  const [scrubberLetterLayouts, setScrubberLetterLayouts] = useState({});
  const [previewBubbleHeight, setPreviewBubbleHeight] = useState(0);

  const preparedContacts = useMemo(
    () => buildAlphabetizedContactsList(contacts),
    [contacts]
  );
  const {
    listItems,
    stickyHeaderIndices,
    scrubberLetters,
    letterToHeaderIndex,
  } = preparedContacts;
  const showScrubber = scrubberLetters.length > 1;
  const displayActiveLetter = isScrubbing
    ? activeScrubLetter || activeSectionLetter
    : activeSectionLetter;
  const hasSearchQuery = searchText.trim().length > 0;
  const showSearchEmptyState =
    contacts.length === 0 && hasSearchQuery && totalContactsCount > 0;
  const listFooterHeight = Platform.OS === "android" ? 230 : 200;
  const scrubberBottomOffset = Math.max(
    insets.bottom + 24,
    listFooterHeight - 20
  );

  useEffect(() => {
    scrubberLetterLookupRef.current = new Set(scrubberLetters);
  }, [scrubberLetters]);

  useEffect(() => {
    setActiveSectionLetter(scrubberLetters[0] || null);
    setActiveScrubLetter(null);
    setIsScrubbing(false);
    setScrubberRailLayout(null);
    setScrubberLetterLayouts({});
    lastScrubbedLetterRef.current = null;
  }, [contacts, scrubberLetters]);

  const activeLetterLayout = activeScrubLetter
    ? scrubberLetterLayouts?.[activeScrubLetter]
    : null;
  const hasPreviewPosition = Boolean(
    isScrubbing &&
      activeScrubLetter &&
      scrubberRailLayout &&
      activeLetterLayout &&
      previewBubbleHeight > 0
  );
  const previewBubbleStyle = hasPreviewPosition
    ? {
        right: scrubberRailLayout.width + SCRUBBER_PREVIEW_GAP,
        top:
          scrubberRailLayout.y +
          activeLetterLayout.y +
          activeLetterLayout.height / 2 -
          previewBubbleHeight / 2,
      }
    : SCRUBBER_PREVIEW_HIDDEN_STYLE;

  const setMeasuredScrubberRailLayout = (nextLayout) => {
    if (!nextLayout) {
      return;
    }

    setScrubberRailLayout((prevLayout) => {
      if (
        prevLayout?.x === nextLayout.x &&
        prevLayout?.y === nextLayout.y &&
        prevLayout?.width === nextLayout.width &&
        prevLayout?.height === nextLayout.height &&
        prevLayout?.pageY === nextLayout.pageY
      ) {
        return prevLayout;
      }

      return nextLayout;
    });
  };

  const measureScrubberRailInWindow = (layout) => {
    if (!layout) {
      return;
    }

    const railNode = scrubberRailRef.current;
    if (!railNode?.measureInWindow) {
      setMeasuredScrubberRailLayout(layout);
      return;
    }

    requestAnimationFrame(() => {
      railNode.measureInWindow(
        (pageX, pageY, measuredWidth, measuredHeight) => {
          setMeasuredScrubberRailLayout({
            ...layout,
            pageX,
            pageY,
            width: measuredWidth || layout.width,
            height: measuredHeight || layout.height,
          });
        }
      );
    });
  };

  const scrollToScrubberLetter = (letter) => {
    const headerIndex = letterToHeaderIndex?.[letter];
    if (typeof headerIndex !== "number") {
      return;
    }

    flashListRef.current?.scrollToIndex({
      animated: false,
      index: headerIndex,
      viewPosition: 0,
    });
  };

  const triggerScrubberHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger("impactLight", SCRUBBER_HAPTIC_OPTIONS);
  };

  const handleScrubberTouch = (event) => {
    if (!showScrubber) {
      return;
    }

    const pageY = event?.nativeEvent?.pageY;
    const fallbackLocationY = event?.nativeEvent?.locationY;
    const railPageY = scrubberRailLayout?.pageY;
    const relativeLocationY =
      typeof pageY === "number" && typeof railPageY === "number"
        ? pageY - railPageY
        : fallbackLocationY;

    if (typeof relativeLocationY !== "number") {
      return;
    }

    const nextLetter = getNearestScrubberLetter(
      relativeLocationY,
      scrubberLetters,
      scrubberLetterLayouts
    );

    if (!nextLetter) {
      return;
    }

    setIsScrubbing(true);
    setActiveScrubLetter(nextLetter);
    setActiveSectionLetter((prevLetter) =>
      prevLetter === nextLetter ? prevLetter : nextLetter
    );

    if (lastScrubbedLetterRef.current === nextLetter) {
      return;
    }

    lastScrubbedLetterRef.current = nextLetter;
    triggerScrubberHapticFeedback();
    scrollToScrubberLetter(nextLetter);
  };

  const handleScrubberStart = (event) => {
    handleScrubberTouch(event);
  };

  const handleScrubberMove = (event) => {
    handleScrubberTouch(event);
  };

  const handleScrubberEnd = () => {
    setIsScrubbing(false);
    setActiveScrubLetter(null);
    lastScrubbedLetterRef.current = null;
  };

  const handleScrubberRailLayout = (event) => {
    const nextLayout = event?.nativeEvent?.layout;

    if (!nextLayout) {
      return;
    }

    measureScrubberRailInWindow(nextLayout);
  };

  const handleScrubberLetterLayout = (letter, nextLayout) => {
    if (!letter || !nextLayout) {
      return;
    }

    setScrubberLetterLayouts((prevLayouts) => {
      const currentLayout = prevLayouts?.[letter];

      if (
        currentLayout?.y === nextLayout.y &&
        currentLayout?.height === nextLayout.height
      ) {
        return prevLayouts;
      }

      return {
        ...prevLayouts,
        [letter]: {
          y: nextLayout.y,
          height: nextLayout.height,
        },
      };
    });
  };

  const handlePreviewBubbleLayout = (event) => {
    const nextHeight = event?.nativeEvent?.layout?.height ?? 0;

    setPreviewBubbleHeight((prevHeight) =>
      prevHeight === nextHeight ? prevHeight : nextHeight
    );
  };

  const handleViewableItemsChanged = useRef(({ viewableItems = [] }) => {
    const nextVisibleItem = viewableItems
      .filter(
        (viewToken) =>
          viewToken?.isViewable &&
          typeof viewToken?.index === "number" &&
          scrubberLetterLookupRef.current.has(viewToken?.item?.letter)
      )
      .sort((firstItem, secondItem) => firstItem.index - secondItem.index)[0];
    const nextLetter = nextVisibleItem?.item?.letter;

    if (!nextLetter) {
      return;
    }

    setActiveSectionLetter((prevLetter) =>
      prevLetter === nextLetter ? prevLetter : nextLetter
    );
  }).current;

  return (
    <View style={[styles.container, style]}>
      {loaderStatus ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={"large"} color={Colors.Primary} />
        </View>
      ) : contacts.length === 0 ? (
        <EmptyState isSearchResultState={showSearchEmptyState} />
      ) : (
        <>
          <FlashList
            ref={flashListRef}
            data={listItems}
            extraData={selectionVersion}
            estimatedItemSize={72}
            estimatedListSize={{ width: width, height: height }}
            stickyHeaderIndices={stickyHeaderIndices}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={handleViewableItemsChanged}
            nestedScrollEnabled={true}
            keyboardDismissMode={"on-drag"}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={styles.contactsList}
            showsVerticalScrollIndicator={false}
            renderItem={(info) =>
              renderContactListItem(info, {
                isSelectEvent,
                selectedContactIds,
                onClickContact,
                hasScrubber: showScrubber,
              })
            }
            getItemType={(item) => item?.type}
            ListFooterComponent={<View style={styles.listFooter} />}
            keyExtractor={(item) => item?.id}
          />
          <AlphabetScrubber
            letters={scrubberLetters}
            highlightedLetter={displayActiveLetter}
            bubbleLetter={activeScrubLetter}
            isScrubbing={isScrubbing}
            scrubberBottomOffset={scrubberBottomOffset}
            scrubberRailRef={scrubberRailRef}
            previewBubbleStyle={previewBubbleStyle}
            onRailLayout={handleScrubberRailLayout}
            onLetterLayout={handleScrubberLetterLayout}
            onPreviewBubbleLayout={handlePreviewBubbleLayout}
            onScrubStart={handleScrubberStart}
            onScrubMove={handleScrubberMove}
            onScrubEnd={handleScrubberEnd}
          />
        </>
      )}
    </View>
  );
};

export default ContactsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contactItemContainerWithScrubber: {
    paddingRight: SCRUBBER_CONTENT_GUTTER,
  },
  contactItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  contactNameText: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 20,
    flex: 1,
  },
  contactInitialContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: Colors.BgColor,
  },
  contactInitialContainerWithScrubber: {
    paddingRight: SCRUBBER_CONTENT_GUTTER,
  },
  contactInitialContainerSticky: {
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 2,
    zIndex: 2,
  },
  contactInitialText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 20,
    fontFamily: FontFamily.OutfitMedium,
    width: 40,
  },
  contactImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  defaultContactImg: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.Primary_Light,
  },
  contactFirstLetter: {
    color: Colors.Primary,
    fontSize: 20,
    fontFamily: FontFamily.OutfitMedium,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "70%",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyStateIconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Bg_Light,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    marginBottom: 20,
  },
  emptyStateTitle: {
    color: Colors.Base_White,
    fontSize: 22,
    fontFamily: FontFamily.OutfitMedium,
    textAlign: "center",
  },
  emptyStateDescription: {
    marginTop: 10,
    color: Colors.Base_Medium_Grey,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.OutfitRegular,
    textAlign: "center",
    maxWidth: 280,
  },
  contactsList: {
    paddingBottom: 0,
  },
  listFooter: {
    height: Platform.OS === "android" ? 230 : 200,
  },
  checkBtn: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    borderRadius: 6,
  },
  checkedBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: Colors.Primary,
  },
});
