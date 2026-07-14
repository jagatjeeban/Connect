import type { Ref } from "react";
import {
  type LayoutRectangle,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

//import constants
import { colors, fontFamily } from "@/constants";

//CONSTANTS
const SCRUBBER_TOP_OFFSET = 20;
const SCRUBBER_RIGHT_OFFSET = 6;

export type AlphabetScrubberProps = {
  letters?: readonly string[];
  highlightedLetter?: string | null;
  bubbleLetter?: string | null;
  isScrubbing?: boolean;
  scrubberBottomOffset?: number;
  scrubberRailRef?: Ref<View>;
  previewBubbleStyle?: StyleProp<ViewStyle>;
  onRailLayout?: ViewProps["onLayout"];
  onLetterLayout?: (letter: string, layout: LayoutRectangle) => void;
  onPreviewBubbleLayout?: ViewProps["onLayout"];
  onScrubStart?: ViewProps["onResponderGrant"];
  onScrubMove?: ViewProps["onResponderMove"];
  onScrubEnd?: ViewProps["onResponderRelease"];
};

const AlphabetScrubber = ({
  letters = [],
  highlightedLetter = null,
  bubbleLetter = null,
  isScrubbing = false,
  scrubberBottomOffset = 0,
  scrubberRailRef,
  previewBubbleStyle,
  onRailLayout,
  onLetterLayout,
  onPreviewBubbleLayout,
  onScrubStart,
  onScrubMove,
  onScrubEnd,
}: AlphabetScrubberProps) => {
  if (letters.length < 2) {
    return null;
  }

  return (
    <View
      style={[
        styles.alphabetScrubberContainer,
        {
          // top: SCRUBBER_TOP_OFFSET,
          right: SCRUBBER_RIGHT_OFFSET,
          bottom: scrubberBottomOffset,
        },
      ]}
    >
      <View
        ref={scrubberRailRef}
        collapsable={false}
        style={styles.alphabetScrubberRail}
        onLayout={onRailLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={onScrubStart}
        onResponderMove={onScrubMove}
        onResponderRelease={onScrubEnd}
        onResponderTerminate={onScrubEnd}
      >
        {letters.map((letter) => (
          <View
            key={letter}
            style={styles.alphabetScrubberSlot}
            onLayout={(event) =>
              onLetterLayout?.(letter, event.nativeEvent.layout)
            }
          >
            <Text
              style={[
                styles.alphabetScrubberText,
                highlightedLetter === letter &&
                  styles.alphabetScrubberTextActive,
              ]}
            >
              {letter}
            </Text>
          </View>
        ))}
      </View>
      <View
        pointerEvents="none"
        onLayout={onPreviewBubbleLayout}
        style={[
          styles.scrubberPreviewBubble,
          previewBubbleStyle,
          (!isScrubbing || !bubbleLetter) && styles.scrubberPreviewBubbleHidden,
        ]}
      >
        <Text style={styles.scrubberPreviewText}>{bubbleLetter ?? ""}</Text>
      </View>
    </View>
  );
};

export default AlphabetScrubber;

const styles = StyleSheet.create({
  alphabetScrubberContainer: {
    position: "absolute",
    width: 34,
    zIndex: 4,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  alphabetScrubberRail: {
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    paddingVertical: 8,
  },
  alphabetScrubberSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 1,
  },
  alphabetScrubberText: {
    color: colors.baseMediumGrey,
    fontSize: 10,
    fontFamily: fontFamily.outfitMedium,
  },
  alphabetScrubberTextActive: {
    color: colors.primary,
    fontFamily: fontFamily.outfitBold,
  },
  scrubberPreviewBubble: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    zIndex: 3,
  },
  scrubberPreviewBubbleHidden: {
    opacity: 0,
  },
  scrubberPreviewText: {
    color: colors.primary,
    fontSize: 34,
    fontFamily: fontFamily.outfitBold,
  },
});
