import { Image } from 'expo-image';
import { Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';

//import constants
import { colors, fontFamily, strings } from '@/constants';

//import components
import { TextComponent } from '@/components';

//import helpers
import { getContactInitial, getContactName } from '@/helpers/custom-functions';

//import assets
import SvgPrimaryFavorite from '@/assets/icons/primary-favorite.svg';

//import types
import type { DeviceContact } from '@/features/contacts/model';

type FavoriteContactItemProps = {
  item: DeviceContact;
  onRemoveFavorite: (contact: DeviceContact) => void;
  onPress?: (contact: DeviceContact) => void;
};

/**
 * Displays one favorite contact in the favorites grid.
 */
const FavoriteContactItem = ({ item, onRemoveFavorite, onPress }: FavoriteContactItemProps) => {
  const contactName = getContactName(item);
  const thumbnail = item.thumbnail?.trim() || item.image?.trim();

  //removes the favorite without triggering the enclosing card action
  const handleRemoveFavorite = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemoveFavorite(item);
  };

  return (
    <Pressable
      accessibilityLabel={contactName}
      accessibilityRole={'button'}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      <View style={styles.contactImageContainer}>
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
              textAlign={'center'}
              fontFamily={fontFamily.outfitMedium}
              styleProfile={'largest1'}
              text={getContactInitial(contactName)}
            />
          </View>
        )}

        <Pressable
          accessibilityLabel={`${strings.removeFromFavorites}: ${contactName}`}
          accessibilityRole={'button'}
          accessibilityState={{ selected: true }}
          hitSlop={8}
          onPress={handleRemoveFavorite}
          style={({ pressed }) => [styles.favoriteButton, pressed && styles.favoriteButtonPressed]}
        >
          <SvgPrimaryFavorite width={16} height={15} />
        </Pressable>
      </View>
      <TextComponent
        color={colors.baseWhite}
        containerStyle={styles.contactNameContainer}
        fontFamily={fontFamily.outfitRegular}
        numOfLine={2}
        styleProfile={'large2'}
        text={contactName}
        textAlign={'center'}
      />
    </Pressable>
  );
};

export default FavoriteContactItem;

const styles = StyleSheet.create({
  container: {
    width: '25%',
    alignItems: 'center',
    paddingTop: 30,
  },
  containerPressed: {
    opacity: 0.7,
  },
  contactImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  contactImageContainer: {
    width: 70,
    height: 70,
  },
  defaultContactImage: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
  },
  favoriteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    backgroundColor: colors.baseDarkBlack,
  },
  favoriteButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  contactInitial: {
    textAlign: 'center',
  },
  contactNameContainer: {
    width: '90%',
    marginTop: 15,
  },
  contactName: {
    textAlign: 'center',
  },
});
