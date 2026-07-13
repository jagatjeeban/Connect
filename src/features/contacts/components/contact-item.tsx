import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontFamily } from "@/constants";
import type { DeviceContact } from "@/features/contacts/model";

const SCRUBBER_CONTENT_GUTTER = 60;
const UNNAMED_CONTACT_LABEL = "Unnamed contact";

export type ContactItemProps = {
  item: DeviceContact;
  isSelectEvent?: boolean;
  isSelected?: boolean;
  onClickEvent?: (contact: DeviceContact) => void;
  hasScrubber?: boolean;
};

const getContactInitial = (name: string): string =>
  Array.from(name.trim())[0]?.toLocaleUpperCase() ?? "#";

const ContactItem = ({
  item,
  isSelectEvent = false,
  isSelected = false,
  onClickEvent,
  hasScrubber = false,
}: ContactItemProps) => {
  const contactName = item.fullName?.trim() || UNNAMED_CONTACT_LABEL;
  const thumbnail = item.thumbnail?.trim();

  return (
    <Pressable
      accessibilityLabel={contactName}
      accessibilityRole="button"
      accessibilityState={isSelectEvent ? { selected: isSelected } : undefined}
      disabled={!onClickEvent}
      onPress={() => onClickEvent?.(item)}
      style={({ pressed }) => [
        styles.contactItemContainer,
        hasScrubber && styles.contactItemContainerWithScrubber,
        pressed && styles.contactItemPressed,
      ]}
    >
      <View style={styles.contactItemLeft}>
        {thumbnail ? (
          <Image
            accessibilityLabel={`${contactName} contact photo`}
            cachePolicy="memory-disk"
            contentFit="cover"
            priority="high"
            recyclingKey={item.id}
            source={thumbnail}
            style={styles.contactImage}
            transition={100}
          />
        ) : (
          <View style={styles.defaultContactImage}>
            <Text style={styles.contactFirstLetter}>
              {getContactInitial(contactName)}
            </Text>
          </View>
        )}
        <Text numberOfLines={1} style={styles.contactNameText}>
          {contactName}
        </Text>
      </View>

      {isSelectEvent &&
        (isSelected ? (
          <View style={styles.checkedButton}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        ) : (
          <View style={styles.checkButton} />
        ))}
    </Pressable>
  );
};

export default ContactItem;

const styles = StyleSheet.create({
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
  contactItemPressed: {
    opacity: 0.7,
  },
  contactItemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  contactImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  defaultContactImage: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
  },
  contactFirstLetter: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fontFamily.outfitMedium,
  },
  contactNameText: {
    flex: 1,
    marginLeft: 20,
    color: colors.baseWhite,
    fontSize: 18,
    fontFamily: fontFamily.outfitRegular,
  },
  checkButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    borderRadius: 6,
  },
  checkedButton: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  checkMark: {
    color: colors.baseWhite,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fontFamily.outfitBold,
  },
});
