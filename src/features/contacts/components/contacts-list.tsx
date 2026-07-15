import { FlashList, type FlashListProps, type FlashListRef, type ListRenderItemInfo } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewabilityConfig,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import components
import AlphabetScrubber from '@/components/alphabet-scrubber';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import EmptyState from './empty-state';

//import constants
import { colors } from '@/constants';

//import helpers
import { getNearestScrubberLetter } from '@/helpers/commonFun';
import { buildAlphabetizedContactsList } from '@/helpers/customFun';

//import types
import type { ContactListItem, DeviceContact } from '@/features/contacts/model';

//constants
const SCRUBBER_PREVIEW_GAP = 8;
const LIST_FOOTER_HEIGHT_IOS = 200;
const LIST_FOOTER_HEIGHT_ANDROID = 230;
const EMPTY_CONTACTS: readonly DeviceContact[] = [];
const SCRUBBER_PREVIEW_HIDDEN_STYLE = { opacity: 0 } satisfies ViewStyle;

type ScrubberLetterLayout = Pick<LayoutRectangle, 'height' | 'y'>;
type ScrubberLetterLayouts = Record<string, ScrubberLetterLayout>;
type MeasuredScrubberRailLayout = LayoutRectangle & {
  pageX?: number;
  pageY?: number;
};

type ContactRenderOptions = {
  isSelectEvent: boolean;
  selectedContactIds: ReadonlySet<string> | null;
  onClickContact?: (contact: DeviceContact) => void;
  hasScrubber: boolean;
};

export type ContactsListProps = {
  contacts?: readonly DeviceContact[];
  loaderStatus?: boolean;
  isSelectEvent?: boolean;
  selectedContactIds?: ReadonlySet<string> | null;
  selectionVersion?: number;
  onClickContact?: (contact: DeviceContact) => void;
  searchText?: string;
  totalContactsCount?: number;
  style?: StyleProp<ViewStyle>;
};

// Renders either a sticky section header or a contact row for FlashList.
const renderContactListItem = (
  { item, target }: ListRenderItemInfo<ContactListItem>,
  options: ContactRenderOptions,
) => {
  if (item.type === 'header') {
    return (
      <ContactSectionHeader
        letter={item.letter}
        isSticky={target === 'StickyHeader'}
        hasScrubber={options.hasScrubber}
      />
    );
  }

  return (
    <ContactItem
      item={item.contact}
      isSelectEvent={options.isSelectEvent}
      isSelected={Boolean(options.selectedContactIds?.has(item.contact.id))}
      onClickEvent={options.onClickContact}
      hasScrubber={options.hasScrubber}
    />
  );
};

// Displays alphabetized contacts and coordinates the interactive letter scrubber.
const ContactsList = ({
  contacts = EMPTY_CONTACTS,
  loaderStatus = false,
  isSelectEvent = false,
  selectedContactIds = null,
  selectionVersion = 0,
  onClickContact,
  searchText = '',
  totalContactsCount = contacts.length,
  style,
}: ContactsListProps) => {
  //hooks
  const insets = useSafeAreaInsets();

  //refs
  const flashListRef = useRef<FlashListRef<ContactListItem>>(null);
  const scrubberRailRef = useRef<View>(null);
  const lastScrubbedLetterRef = useRef<string | null>(null);
  const viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 1,
  }).current;

  // Keeps the highlighted section synchronized with the first visible list item.
  const handleViewableItemsChanged = useRef<NonNullable<FlashListProps<ContactListItem>['onViewableItemsChanged']>>(
    ({ viewableItems }) => {
      const firstVisibleItem = [...viewableItems]
        .filter((viewToken) => viewToken.isViewable && typeof viewToken.index === 'number')
        .sort((firstItem, secondItem) => (firstItem.index ?? 0) - (secondItem.index ?? 0))[0]?.item;

      if (!firstVisibleItem) return;

      setActiveSectionLetter((previousLetter) =>
        previousLetter === firstVisibleItem.letter ? previousLetter : firstVisibleItem.letter,
      );
    },
  ).current;

  //states
  const [activeSectionLetter, setActiveSectionLetter] = useState<string | null>(null);
  const [activeScrubLetter, setActiveScrubLetter] = useState<string | null>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [scrubberRailLayout, setScrubberRailLayout] = useState<MeasuredScrubberRailLayout | null>(null);
  const [scrubberLetterLayouts, setScrubberLetterLayouts] = useState<ScrubberLetterLayouts>({});
  const [previewBubbleHeight, setPreviewBubbleHeight] = useState(0);

  const preparedContacts = useMemo(() => buildAlphabetizedContactsList(contacts), [contacts]);
  const { listItems, stickyHeaderIndices, scrubberLetters, letterToHeaderIndex } = preparedContacts;
  const showScrubber = scrubberLetters.length > 1;
  const displayActiveLetter = isScrubbing ? (activeScrubLetter ?? activeSectionLetter) : activeSectionLetter;
  const hasSearchQuery = searchText.trim().length > 0;
  const showSearchEmptyState = contacts.length === 0 && hasSearchQuery && totalContactsCount > 0;
  const listFooterHeight = Platform.OS === 'android' ? LIST_FOOTER_HEIGHT_ANDROID : LIST_FOOTER_HEIGHT_IOS;
  const scrubberBottomOffset = Math.max(insets.bottom + 24, listFooterHeight - 20);

  // Resets scrubber state whenever the available contact sections change.
  useEffect(() => {
    setActiveSectionLetter(scrubberLetters[0] ?? null);
    setActiveScrubLetter(null);
    setIsScrubbing(false);
    setScrubberRailLayout(null);
    setScrubberLetterLayouts({});
    lastScrubbedLetterRef.current = null;
  }, [scrubberLetters]);

  const activeLetterLayout = activeScrubLetter ? scrubberLetterLayouts[activeScrubLetter] : undefined;
  const previewBubbleStyle: ViewStyle =
    isScrubbing && activeScrubLetter && scrubberRailLayout && activeLetterLayout && previewBubbleHeight > 0
      ? {
          right: scrubberRailLayout.width + SCRUBBER_PREVIEW_GAP,
          top: scrubberRailLayout.y + activeLetterLayout.y + activeLetterLayout.height / 2 - previewBubbleHeight / 2,
        }
      : SCRUBBER_PREVIEW_HIDDEN_STYLE;

  // Stores rail measurements only when its size or position has changed.
  const setMeasuredScrubberRailLayout = useCallback((nextLayout: MeasuredScrubberRailLayout) => {
    setScrubberRailLayout((previousLayout) => {
      if (
        previousLayout?.x === nextLayout.x &&
        previousLayout.y === nextLayout.y &&
        previousLayout.width === nextLayout.width &&
        previousLayout.height === nextLayout.height &&
        previousLayout.pageX === nextLayout.pageX &&
        previousLayout.pageY === nextLayout.pageY
      ) {
        return previousLayout;
      }

      return nextLayout;
    });
  }, []);

  // Measures the scrubber rail in window coordinates for accurate touch tracking.
  const measureScrubberRailInWindow = useCallback(
    (layout: LayoutRectangle) => {
      const railNode = scrubberRailRef.current;

      if (!railNode) {
        setMeasuredScrubberRailLayout(layout);
        return;
      }

      requestAnimationFrame(() => {
        railNode.measureInWindow((pageX, pageY, width, height) => {
          setMeasuredScrubberRailLayout({
            ...layout,
            pageX,
            pageY,
            width: width || layout.width,
            height: height || layout.height,
          });
        });
      });
    },
    [setMeasuredScrubberRailLayout],
  );

  // Jumps the contact list to the header associated with a scrubber letter.
  const scrollToScrubberLetter = useCallback(
    (letter: string) => {
      const headerIndex = letterToHeaderIndex[letter];

      if (typeof headerIndex !== 'number') return;

      flashListRef.current?.scrollToIndex({
        animated: false,
        index: headerIndex,
        viewPosition: 0,
      });
    },
    [letterToHeaderIndex],
  );

  // Provides tactile feedback when scrubbing enters a different letter.
  const triggerScrubberHapticFeedback = useCallback(() => {
    void Haptics.selectionAsync().catch(() => undefined);
  }, []);

  // Resolves each scrub gesture to a letter and scrolls to its contact section.
  const handleScrubberTouch = useCallback(
    (event: GestureResponderEvent) => {
      if (!showScrubber) return;

      const { locationY, pageY } = event.nativeEvent;
      const railPageY = scrubberRailLayout?.pageY;
      const relativeLocationY = typeof railPageY === 'number' ? pageY - railPageY : locationY;
      const nextLetter = getNearestScrubberLetter(relativeLocationY, scrubberLetters, scrubberLetterLayouts);

      if (!nextLetter) return;

      setIsScrubbing(true);
      setActiveScrubLetter(nextLetter);
      setActiveSectionLetter((previousLetter) => (previousLetter === nextLetter ? previousLetter : nextLetter));

      if (lastScrubbedLetterRef.current === nextLetter) return;

      lastScrubbedLetterRef.current = nextLetter;
      triggerScrubberHapticFeedback();
      scrollToScrubberLetter(nextLetter);
    },
    [
      scrubberLetterLayouts,
      scrubberLetters,
      scrubberRailLayout?.pageY,
      scrollToScrubberLetter,
      showScrubber,
      triggerScrubberHapticFeedback,
    ],
  );

  // Clears transient scrubber state when the touch interaction finishes.
  const handleScrubberEnd = useCallback(() => {
    setIsScrubbing(false);
    setActiveScrubLetter(null);
    lastScrubbedLetterRef.current = null;
  }, []);

  // Re-measures the scrubber rail after React Native reports a layout change.
  const handleScrubberRailLayout = useCallback(
    (event: LayoutChangeEvent) => {
      measureScrubberRailInWindow(event.nativeEvent.layout);
    },
    [measureScrubberRailInWindow],
  );

  // Caches each scrubber letter's vertical position for touch hit resolution.
  const handleScrubberLetterLayout = useCallback((letter: string, nextLayout: LayoutRectangle) => {
    setScrubberLetterLayouts((previousLayouts) => {
      const currentLayout = previousLayouts[letter];

      if (currentLayout?.y === nextLayout.y && currentLayout.height === nextLayout.height) {
        return previousLayouts;
      }

      return {
        ...previousLayouts,
        [letter]: {
          y: nextLayout.y,
          height: nextLayout.height,
        },
      };
    });
  }, []);

  // Tracks the preview bubble height so it can be centered on the active letter.
  const handlePreviewBubbleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    setPreviewBubbleHeight((previousHeight) => (previousHeight === nextHeight ? previousHeight : nextHeight));
  }, []);

  const renderOptions = useMemo<ContactRenderOptions>(
    () => ({
      isSelectEvent,
      selectedContactIds,
      onClickContact,
      hasScrubber: showScrubber,
    }),
    [isSelectEvent, onClickContact, selectedContactIds, showScrubber],
  );

  // Reuses the row renderer until its selection or scrubber options change.
  const renderItem = useCallback(
    (info: ListRenderItemInfo<ContactListItem>) => renderContactListItem(info, renderOptions),
    [renderOptions],
  );
  const listExtraData = useMemo(() => ({ renderOptions, selectionVersion }), [renderOptions, selectionVersion]);

  return (
    <View style={[styles.container, style]}>
      {loaderStatus ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      ) : contacts.length === 0 ? (
        <EmptyState isSearchResultState={showSearchEmptyState} />
      ) : (
        <>
          <FlashList
            ref={flashListRef}
            data={listItems}
            extraData={listExtraData}
            stickyHeaderIndices={stickyHeaderIndices}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={handleViewableItemsChanged}
            nestedScrollEnabled
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.contactsList}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            getItemType={(item) => item.type}
            ListFooterComponent={<View style={styles.listFooter} />}
            keyExtractor={(item) => item.id}
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
            onScrubStart={handleScrubberTouch}
            onScrubMove={handleScrubberTouch}
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactsList: {
    paddingBottom: 0,
  },
  listFooter: {
    height: Platform.OS === 'android' ? LIST_FOOTER_HEIGHT_ANDROID : LIST_FOOTER_HEIGHT_IOS,
  },
});
