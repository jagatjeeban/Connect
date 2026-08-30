import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { colors, fontFamily, strings } from '@/constants';

//import components
import TextComponent from './core-components/text-component';

//import assets
import SvgBackGrey from '@/assets/icons/back-arrow-grey.svg';
import SvgCross from '@/assets/icons/cross-grey.svg';
import SvgSearch from '@/assets/icons/search.svg';

type HomeHeaderProps = {
  placeholder: string;
  searchInput: string;
  searchBlur?: () => void;
  searchEvent: (req: string) => void;
};

/**
 * Displays the shared contacts and favorites search header.
 */
const HomeHeader = ({ placeholder, searchInput, searchBlur, searchEvent }: HomeHeaderProps) => {
  //hooks
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  //states
  const [searchStatus, setSearchStatus] = useState(false);

  //function to open the search input
  const handleSearchOpen = () => {
    setSearchStatus(true);
  };

  //function to handle system backpress
  const handleBackPress = useCallback(() => {
    if (searchStatus) {
      Keyboard.dismiss();
      setSearchStatus(false);
      searchEvent('');
      return true;
    }
    return false;
  }, [searchEvent, searchStatus]);

  //function to handle the change in input value
  const handleInputChange = (input: string) => {
    searchEvent(input);
  };

  //function to handle the search input clear event
  const handleSearchClear = () => {
    searchEvent('');
  };

  //function to dismiss the keyboard after submitting a search
  const handleSearchSubmit = () => {
    Keyboard.dismiss();
  };

  //registers Android back handling while this header's screen is focused
  useEffect(() => {
    if (!isFocused) return undefined;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress, isFocused]);

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.searchContainer}>
        {!searchStatus ? (
          <Pressable
            accessibilityLabel={placeholder}
            accessibilityRole={'button'}
            onPress={handleSearchOpen}
            style={styles.inactiveSearchButton}
          >
            <View style={styles.searchRow}>
              <SvgSearch />
              <TextComponent
                color={colors.baseMediumGrey}
                containerStyle={styles.searchTextContainer}
                fontFamily={fontFamily.outfitRegular}
                styleProfile={'large1'}
                text={placeholder}
              />
            </View>
          </Pressable>
        ) : (
          <View style={styles.activeSearchContainer}>
            <Pressable
              accessibilityLabel={strings.closeSearch}
              accessibilityRole={'button'}
              onPress={handleBackPress}
              style={styles.searchActionButton}
            >
              <SvgBackGrey />
            </Pressable>
            <TextInput
              accessibilityLabel={placeholder}
              autoCapitalize={'words'}
              autoFocus={true}
              autoCorrect={false}
              enterKeyHint={'search'}
              onBlur={searchBlur}
              onChangeText={handleInputChange}
              onSubmitEditing={handleSearchSubmit}
              placeholder={placeholder}
              placeholderTextColor={colors.baseMediumGrey}
              returnKeyType={'search'}
              selectionColor={colors.primary}
              style={styles.searchInput}
              value={searchInput}
            />
            {searchInput !== '' && (
              <Pressable
                accessibilityLabel={strings.clearSearch}
                accessibilityRole={'button'}
                onPress={handleSearchClear}
                style={styles.searchActionButton}
              >
                <SvgCross />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    backgroundColor: colors.backgroundLight,
    overflow: 'hidden',
  },
  inactiveSearchButton: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchTextContainer: {
    marginLeft: 10,
  },
  activeSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  searchActionButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    color: colors.baseWhite,
    fontSize: 17,
    fontFamily: fontFamily.outfitRegular,
    includeFontPadding: false,
  },
});
