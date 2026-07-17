import { StyleSheet, View } from 'react-native';

//import constants
import { colors, fontFamily, strings } from '@/constants';

//import components
import { SearchEmptyAction, TextComponent } from '@/components';

//import assets
import SvgFavorite from '@/assets/icons/favourites.svg';
import SvgSearch from '@/assets/icons/search.svg';

//import types
import type { EmptyStateProps } from '@/features/favorites/model';

/**
 * Displays the favorites empty state for either saved data or search results.
 */
const EmptyState = ({ isSearchResultState = false, onClearSearch }: EmptyStateProps) => {
  const title = isSearchResultState ? strings.noResultsFound : strings.noFavoritesYet;
  const description = isSearchResultState ? strings.favoritesSearchEmptyDescription : strings.favoritesEmptyDescription;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {isSearchResultState ? <SvgSearch width={34} height={34} /> : <SvgFavorite width={34} height={30} />}
      </View>
      <TextComponent color={colors.baseWhite} styleProfile={'large4'} text={title} textAlign={'center'} />
      <TextComponent
        color={colors.baseMediumGrey}
        containerStyle={styles.descriptionContainer}
        fontFamily={fontFamily.outfitRegular}
        styleProfile={'large1'}
        text={description}
        textAlign={'center'}
      />
      {isSearchResultState && onClearSearch ? <SearchEmptyAction onPress={onClearSearch} /> : null}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  iconWrapper: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
  },
  descriptionContainer: {
    maxWidth: 300,
    marginTop: 10,
  },
});
