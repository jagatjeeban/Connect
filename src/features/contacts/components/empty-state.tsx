import { StyleSheet, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import { TextComponent } from '@/components';

//import svg files
import SvgContacts from '@/assets/icons/contacts.svg';
import SvgSearch from '@/assets/icons/search.svg';

type EmptyStateProps = {
  isSearchResultState: boolean;
};

const EmptyState = ({ isSearchResultState = false }: EmptyStateProps) => {
  const title = isSearchResultState ? 'No results found' : 'No contacts yet';
  const description = isSearchResultState
    ? 'Try a different name or clear your search to see all contacts.'
    : 'Your saved contacts will show up here once they are available.';

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconWrapper}>
        {isSearchResultState ? <SvgSearch width={34} height={34} /> : <SvgContacts width={28} height={34} />}
      </View>
      <TextComponent color={colors.baseWhite} styleProfile='large4' text={title} textAlign='center' />
      <TextComponent
        color={colors.baseMediumGrey}
        containerStyle={styles.descriptionContainer}
        styleProfile='large1'
        text={description}
        textAlign='center'
      />
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
