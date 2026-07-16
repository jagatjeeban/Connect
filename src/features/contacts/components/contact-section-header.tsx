import { StyleSheet, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import { TextComponent } from '@/components';

//constants
const SCRUBBER_CONTENT_GUTTER = 60;

type ContactSectionHeaderProps = {
  letter: string;
  isSticky?: boolean;
  hasScrubber?: boolean;
};

/**
 * Displays an alphabetical contacts section heading.
 */
const ContactSectionHeader = ({ letter, isSticky = false, hasScrubber = false }: ContactSectionHeaderProps) => (
  <View style={[styles.container, hasScrubber && styles.containerWithScrubber, isSticky && styles.stickyContainer]}>
    <TextComponent
      color={colors.baseMediumGrey}
      containerStyle={styles.initialContainer}
      styleProfile={'large3'}
      text={letter}
    />
  </View>
);

export default ContactSectionHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: colors.backgroundColor,
  },
  containerWithScrubber: {
    paddingRight: SCRUBBER_CONTENT_GUTTER,
  },
  stickyContainer: {
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 2,
    zIndex: 2,
  },
  initialContainer: {
    width: 40,
  },
});
