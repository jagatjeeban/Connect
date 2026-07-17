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

//import models
import {
  FAVORITE_BUTTON_BACKGROUND,
  FAVORITE_CARD_GRADIENT,
  FAVORITE_CARD_HEIGHTS,
  type FavoriteContactItemProps,
} from '@/features/favorites/model';

//function to keep a contact's card height stable across searches and masonry reordering
const getFavoriteCardHeight = (contactId: string): number => {
  const hash = Array.from(contactId).reduce((currentHash, character) => {
    return (currentHash * 31 + (character.codePointAt(0) ?? 0)) >>> 0;
  }, 0);

  return FAVORITE_CARD_HEIGHTS[hash % FAVORITE_CARD_HEIGHTS.length];
};

/**
 * Displays one favorite contact as an image-led masonry card.
 */
const FavoriteContactItem = ({ item, onRemoveFavorite, onPress }: FavoriteContactItemProps) => {
  const contactName = getContactName(item);
  const contactImage = item.image?.trim() || item.thumbnail?.trim();
  const cardHeight = getFavoriteCardHeight(item.id);

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
      style={({ pressed }) => [styles.container, { height: cardHeight }, pressed && styles.containerPressed]}
    >
      {contactImage ? (
        <Image
          accessibilityLabel={`${contactName} contact photo`}
          cachePolicy={'memory-disk'}
          contentFit={'cover'}
          priority={'normal'}
          recyclingKey={item.id}
          source={contactImage}
          style={styles.contactImage}
          transition={150}
        />
      ) : (
        <View style={styles.defaultContactImage}>
          <TextComponent
            color={colors.primary}
            textAlign={'center'}
            fontFamily={fontFamily.outfitSemiBold}
            styleProfile={'largest3'}
            text={getContactInitial(contactName)}
          />
        </View>
      )}

      <View pointerEvents={'none'} style={styles.gradientOverlay} />

      <TextComponent
        color={colors.baseWhite}
        containerStyle={styles.contactNameContainer}
        fontFamily={fontFamily.outfitMedium}
        numOfLine={2}
        styleProfile={'large1'}
        text={contactName}
      />

      <Pressable
        accessibilityLabel={`${strings.removeFromFavorites}: ${contactName}`}
        accessibilityRole={'button'}
        accessibilityState={{ selected: true }}
        hitSlop={6}
        onPress={handleRemoveFavorite}
        style={({ pressed }) => [styles.favoriteButton, pressed && styles.favoriteButtonPressed]}
      >
        <SvgPrimaryFavorite width={18} height={17} />
      </Pressable>
    </Pressable>
  );
};

export default FavoriteContactItem;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: colors.primaryLight,
  },
  containerPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  contactImage: {
    ...StyleSheet.absoluteFill,
  },
  defaultContactImage: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage: FAVORITE_CARD_GRADIENT,
  },
  contactNameContainer: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    left: 14,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    backgroundColor: FAVORITE_BUTTON_BACKGROUND,
  },
  favoriteButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});
