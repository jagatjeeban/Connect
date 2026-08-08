import { Pressable, StyleSheet, View } from 'react-native';

//import constants
import { colors, fontFamily } from '@/constants';

//import components
import { TextComponent } from '@/components';
import ContactAvatar from '@/features/contacts/components/contact-avatar';

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

  //opens the selected contact
  const handlePress = () => {
    onClickEvent?.(item);
  };

  return (
    <Pressable
      accessibilityLabel={contactName}
      accessibilityRole={'button'}
      accessibilityState={isSelectEvent ? { selected: isSelected } : undefined}
      disabled={!onClickEvent}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.contactItemContainer,
        hasScrubber && styles.contactItemContainerWithScrubber,
        pressed && styles.contactItemPressed,
      ]}
    >
      <View style={styles.contactItemLeft}>
        <View>
          <ContactAvatar
            accessibilityLabel={`${contactName} contact photo`}
            fallbackBackgroundColor={colors.primaryLight}
            fallbackTextColor={colors.primary}
            fallbackTextStyle={'large3'}
            initial={getContactInitial(contactName)}
            recyclingKey={item.id}
            style={styles.contactImage}
            thumbnail={thumbnail}
            transition={100}
          />
        </View>

        <View style={styles.contactNameContainer}>
          <TextComponent
            color={colors.baseWhite}
            fontFamily={fontFamily.outfitRegular}
            numOfLine={1}
            styleProfile={'large2'}
            text={contactName}
          />
        </View>
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
