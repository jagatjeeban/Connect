import { StyleSheet, View } from 'react-native';

//import components
import TextComponent from '@/components/core-components/text-component';

//import constants
import { colors, fontFamily } from '@/constants';

//import svgs
import SvgFavorite from '@/assets/icons/favourites.svg';
import SvgSearch from '@/assets/icons/search.svg';

type EmptyStateProps = {
  isSearchResultState?: boolean;
};

const EmptyState = ({ isSearchResultState = false }: EmptyStateProps) => {
  const title = isSearchResultState ? 'No results found' : 'No favorites yet';
  const description = isSearchResultState
    ? 'Try a different name or clear your search to see your favorites again.'
    : 'Add your go-to people to favorites so they are easier to reach from here.';

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {isSearchResultState ? <SvgSearch width={34} height={34} /> : <SvgFavorite width={34} height={30} />}
      </View>
      <TextComponent color={colors.baseWhite} styleProfile='large4' text={title} textAlign='center' />
      <TextComponent
        color={colors.baseMediumGrey}
        containerStyle={styles.descriptionContainer}
        fontFamily={fontFamily.outfitRegular}
        styleProfile='large1'
        text={description}
        textAlign='center'
      />
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
