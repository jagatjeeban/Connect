import React from "react";
import { StyleSheet, Text, View } from "react-native";

//import constants
import { Colors, FontFamily } from "../common/constants";

const SCRUBBER_TOP_OFFSET = 16;
const SCRUBBER_RIGHT_OFFSET = 6;

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
}) => {
  if (letters.length < 2) {
    return null;
  }

  return (
    <View
      style={[
        styles.alphabetScrubberContainer,
        {
          top: SCRUBBER_TOP_OFFSET,
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
              onLetterLayout?.(letter, event?.nativeEvent?.layout)
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
        <Text style={styles.scrubberPreviewText}>{bubbleLetter || ""}</Text>
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
    backgroundColor: Colors.Bg_Light,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    paddingVertical: 8,
  },
  alphabetScrubberSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 1,
  },
  alphabetScrubberText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 10,
    fontFamily: FontFamily.OutfitMedium,
  },
  alphabetScrubberTextActive: {
    color: Colors.Primary,
    fontFamily: FontFamily.OutfitBold,
  },
  scrubberPreviewBubble: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Bg_Light,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    zIndex: 3,
  },
  scrubberPreviewBubbleHidden: {
    opacity: 0,
  },
  scrubberPreviewText: {
    color: Colors.Primary,
    fontSize: 34,
    fontFamily: FontFamily.OutfitBold,
  },
});
