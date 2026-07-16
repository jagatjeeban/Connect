import type { Ref } from 'react';
import { type LayoutRectangle, type StyleProp, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

//import constants
import { colors, fontFamily } from '@/constants';

//import components
import TextComponent from './core-components/text-component';

//CONSTANTS
const SCRUBBER_IOS_VERTICAL_OFFSET = 20;
const SCRUBBER_RIGHT_OFFSET = 6;

export type AlphabetScrubberProps = {
  letters?: readonly string[];
  highlightedLetter?: string | null;
  bubbleLetter?: string | null;
  isScrubbing?: boolean;
  scrubberBottomOffset?: number;
  scrubberRailRef?: Ref<View>;
  previewBubbleStyle?: StyleProp<ViewStyle>;
  onRailLayout?: ViewProps['onLayout'];
  onLetterLayout?: (letter: string, layout: LayoutRectangle) => void;
  onPreviewBubbleLayout?: ViewProps['onLayout'];
  onScrubStart?: ViewProps['onResponderGrant'];
  onScrubMove?: ViewProps['onResponderMove'];
  onScrubEnd?: ViewProps['onResponderRelease'];
};

/**
 * Displays an interactive alphabet rail with an optional active-letter preview.
 */
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
          right: SCRUBBER_RIGHT_OFFSET,
          bottom: scrubberBottomOffset + (process.env.EXPO_OS === 'ios' ? SCRUBBER_IOS_VERTICAL_OFFSET : 0),
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
            onLayout={(event) => onLetterLayout?.(letter, event.nativeEvent.layout)}
          >
            <TextComponent
              color={highlightedLetter === letter ? colors.primary : colors.baseMediumGrey}
              fontFamily={highlightedLetter === letter ? fontFamily.outfitBold : fontFamily.outfitMedium}
              styleProfile={'small3'}
              text={letter}
              textAlign={'center'}
            />
          </View>
        ))}
      </View>
      <View
        pointerEvents={'none'}
        onLayout={onPreviewBubbleLayout}
        style={[
          styles.scrubberPreviewBubble,
          previewBubbleStyle,
          (!isScrubbing || !bubbleLetter) && styles.scrubberPreviewBubbleHidden,
        ]}
      >
        <TextComponent
          color={colors.primary}
          styleProfile={'largest2'}
          text={bubbleLetter ?? ''}
          textAlign={'center'}
        />
      </View>
    </View>
  );
};

export default AlphabetScrubber;

const styles = StyleSheet.create({
  alphabetScrubberContainer: {
    position: 'absolute',
    width: 34,
    zIndex: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  alphabetScrubberRail: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    paddingVertical: 8,
  },
  alphabetScrubberSlot: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  scrubberPreviewBubble: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    zIndex: 3,
  },
  scrubberPreviewBubbleHidden: {
    opacity: 0,
  },
});
