import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useIsFocused } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { colors, fontFamily } from '@/constants';

//import components
import TextComponent from './core-components/text-component';

//import assets
import SvgBackGrey from '@/assets/icons/back-arrow-grey.svg';
import SvgCross from '@/assets/icons/cross-grey.svg';
import SvgSearch from '@/assets/icons/search.svg';

type HomeHeaderProps = {
  placeholder: string;
  menuBtn: boolean;
  searchBlur?: () => void;
  searchEvent: (req: string) => void;
};

/**
 * Displays the shared contacts and favorites search header.
 */
const HomeHeader = ({ placeholder = 'Search', menuBtn = false, searchBlur, searchEvent }: HomeHeaderProps) => {
  //hooks
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  //states
  const [searchInput, setSearchInput] = useState('');
  const [searchStatus, setSearchStatus] = useState(false);

  //function to handle system backpress
  const handleBackPress = useCallback(() => {
    if (searchStatus) {
      setSearchStatus(false);
      searchEvent('');
      setSearchInput('');
      return true;
    }
    return false;
  }, [searchEvent, searchStatus]);

  //function to handle the change in input value
  const handleInputChange = useCallback(
    (input: string) => {
      searchEvent(input);
      setSearchInput(input);
    },
    [searchEvent],
  );

  //function to handle the search input clear event
  const handleSearchClear = useCallback(() => {
    searchEvent('');
    setSearchInput('');
  }, [searchEvent]);

  //registers Android back handling while this header's screen is focused
  useEffect(() => {
    if (!isFocused) return undefined;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress, isFocused]);

  return (
    <View style={[styles.mainContainer, !searchStatus && styles.mainContainerPadded, { paddingTop: insets.top + 10 }]}>
      {!searchStatus ? (
        <Pressable
          onPress={() => setSearchStatus(true)}
          style={[styles.searchContainer, !menuBtn && styles.searchContainerCompact]}
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
          <View style={styles.activeSearchLeft}>
            <Pressable onPress={handleBackPress} style={styles.searchActionButton}>
              <SvgBackGrey />
            </Pressable>
            <TextInput
              placeholder={placeholder}
              selectionColor={colors.primary}
              placeholderTextColor={colors.baseMediumGrey}
              value={searchInput}
              autoFocus={true}
              style={styles.searchInput}
              onBlur={searchBlur}
              onChangeText={handleInputChange}
            />
          </View>
          {searchInput !== '' && (
            <Pressable onPress={handleSearchClear} style={styles.searchActionButton}>
              <SvgCross />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContainerPadded: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderColor: colors.baseGrey,
    backgroundColor: colors.backgroundLight,
  },
  searchContainerCompact: {
    paddingVertical: 14,
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
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.baseGrey,
    paddingBottom: 20,
  },
  activeSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '87%',
  },
  searchActionButton: {
    paddingHorizontal: 20,
  },
  searchInput: {
    color: colors.baseWhite,
    fontSize: 16,
    fontFamily: fontFamily.outfitRegular,
    width: '85%',
  },
});
