import { StyleSheet, View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { SearchEmptyAction, TextComponent } from '@/components';

//import assets
import SvgContacts from '@/assets/icons/contacts.svg';
import SvgSearch from '@/assets/icons/search.svg';

type EmptyStateProps = {
  isSearchResultState: boolean;
  onClearSearch?: () => void;
};

/**
 * Displays the contacts empty state for either an empty address book or search results.
 */
const EmptyState = ({ isSearchResultState = false, onClearSearch }: EmptyStateProps) => {
  const title = isSearchResultState ? strings.noResultsFound : strings.noContactsYet;
  const description = isSearchResultState ? strings.contactsSearchEmptyDescription : strings.contactsEmptyDescription;

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconWrapper}>
        {isSearchResultState ? <SvgSearch width={34} height={34} /> : <SvgContacts width={28} height={34} />}
      </View>
      <TextComponent color={colors.baseWhite} styleProfile={'large4'} text={title} textAlign={'center'} />
      <TextComponent
        color={colors.baseMediumGrey}
        containerStyle={styles.descriptionContainer}
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
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyStateIconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    marginBottom: 20,
  },
  descriptionContainer: {
    marginTop: 10,
    maxWidth: 280,
  },
});
