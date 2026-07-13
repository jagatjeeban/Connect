import { StyleSheet, Text, View } from "react-native";

import { colors, fontFamily } from "@/constants";

const SCRUBBER_CONTENT_GUTTER = 60;

type ContactSectionHeaderProps = {
  letter: string;
  isSticky?: boolean;
  hasScrubber?: boolean;
};

const ContactSectionHeader = ({
  letter,
  isSticky = false,
  hasScrubber = false,
}: ContactSectionHeaderProps) => (
  <View
    style={[
      styles.container,
      hasScrubber && styles.containerWithScrubber,
      isSticky && styles.stickyContainer,
    ]}
  >
    <Text style={styles.initial}>{letter}</Text>
  </View>
);

export default ContactSectionHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  initial: {
    width: 40,
    color: colors.baseMediumGrey,
    fontSize: 20,
    fontFamily: fontFamily.outfitMedium,
  },
});
