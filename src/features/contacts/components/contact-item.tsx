import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

//import constants
import { colors, fontFamily } from '@/constants';

//import components
import { TextComponent } from '@/components';

//import helpers
import { getContactInitial, getContactName } from '@/helpers/custom-functions';

//import types
import type { DeviceContact } from '@/features/contacts/model';

//constants
const SCRUBBER_CONTENT_GUTTER = 60;

export type ContactItemProps = {
  item: DeviceContact;
  isSelectEvent?: boolean;
  isSelected?: boolean;
  onClickEvent?: (contact: DeviceContact) => void;
  hasScrubber?: boolean;
};

/**
 * Displays one contact row with an image fallback and optional selection state.
 */
const ContactItem = ({
  item,
  isSelectEvent = false,
  isSelected = false,
  onClickEvent,
  hasScrubber = false,
}: ContactItemProps) => {
  const contactName = getContactName(item);
  const thumbnail = item.thumbnail?.trim() || item.image?.trim();

  return (
    <Pressable
      accessibilityLabel={contactName}
      accessibilityRole={'button'}
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
            cachePolicy={'memory-disk'}
            contentFit={'cover'}
            priority={'high'}
            recyclingKey={item.id}
            source={thumbnail}
            style={styles.contactImage}
            transition={100}
          />
        ) : (
          <View style={styles.defaultContactImage}>
            <TextComponent
              color={colors.primary}
              styleProfile={'large3'}
              text={getContactInitial(contactName)}
              textAlign={'center'}
            />
          </View>
        )}
        <TextComponent
          color={colors.baseWhite}
          containerStyle={styles.contactNameContainer}
          fontFamily={fontFamily.outfitRegular}
          numOfLine={1}
          styleProfile={'large2'}
          text={contactName}
        />
      </View>

      {isSelectEvent &&
        (isSelected ? (
          <View style={styles.checkedButton}>
            <TextComponent
              color={colors.baseWhite}
              fontFamily={fontFamily.outfitBold}
              styleProfile={'normal2'}
              text={'✓'}
              textAlign={'center'}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
  },
  contactNameContainer: {
    flex: 1,
    marginLeft: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});
