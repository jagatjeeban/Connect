import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  type ColorValue,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { colors, fontFamily, strings } from '@/constants';

//import components
import TextComponent from '../core-components/text-component';

//import assets
import SvgBackGrey from '@/assets/icons/back-arrow-grey.svg';
import SvgBackArrow from '@/assets/icons/back-arrow.svg';
import SvgCross from '@/assets/icons/cross-grey.svg';
import SvgCrossWhite from '@/assets/icons/cross-white.svg';
import SvgPencil from '@/assets/icons/pencil.svg';
import SvgAdd from '@/assets/icons/plus.svg';
import SvgSearch from '@/assets/icons/search-white.svg';
import SvgShare from '@/assets/icons/share-white.svg';
import SvgTrash from '@/assets/icons/trash.svg';
import SvgWhiteStar from '@/assets/icons/white-favorite.svg';

//import types
import type { PageHeaderAction, PageHeaderIcon } from './types';

export type NormalHeaderProps = {
  placeholder: string;
  backBtn: boolean;
  crossBtn: boolean;
  loaderStatus: boolean;
  headerTitle: string;
  headerTitleColor: ColorValue;
  iconArr: readonly PageHeaderIcon[];
  customClickEvent?: () => void;
  rightBtnClickEvent?: (action: PageHeaderAction) => void;
  searchStatus: boolean;
  updateSearchStatus: () => void;
  searchBlur?: TextInputProps['onBlur'];
  textChangeEvent?: (value: string) => void;
};

/**
 * Displays the standard page header with navigation, actions, and search states.
 */
const NormalHeader = ({
  placeholder,
  backBtn,
  crossBtn,
  loaderStatus,
  headerTitle,
  headerTitleColor,
  iconArr,
  customClickEvent,
  rightBtnClickEvent,
  searchStatus,
  updateSearchStatus,
  searchBlur,
  textChangeEvent,
}: NormalHeaderProps) => {
  //hooks
  const insets = useSafeAreaInsets();

  //states
  const [searchInput, setSearchInput] = useState('');

  //refs
  const searchRef = useRef<TextInput>(null);

  //updates local and consumer-owned search input
  const handleSearchInputChange = useCallback(
    (value: string = '') => {
      textChangeEvent?.(value);
      setSearchInput(value);
    },
    [textChangeEvent],
  );

  //function to handle header back press
  const handleBackPress = useCallback(() => {
    if (customClickEvent) {
      customClickEvent();
    } else {
      router.back();
    }
  }, [customClickEvent]);

  //function to handle the system back press event
  const handleSystemBackPress = useCallback(() => {
    if (searchStatus) {
      updateSearchStatus();
      handleSearchInputChange('');
      return true;
    }
    return false;
  }, [handleSearchInputChange, searchStatus, updateSearchStatus]);

  //focuses the search input whenever search mode opens
  useEffect(() => {
    if (searchStatus) {
      searchRef.current?.focus();
    }
  }, [searchStatus]);

  //registers Android back handling for the header search state
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleSystemBackPress);
    return () => backHandler.remove();
  }, [handleSystemBackPress]);

  return (
    <View style={[styles.body, { paddingTop: insets.top + 10 }]}>
      {!searchStatus ? (
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {backBtn || crossBtn ? (
              <>
                <Pressable hitSlop={10} onPress={handleBackPress} style={styles.headerActionButton}>
                  {backBtn === true && <SvgBackArrow />}
                  {crossBtn === true && <SvgCrossWhite />}
                </Pressable>
                <TextComponent color={headerTitleColor} styleProfile={'large3'} text={headerTitle} />
              </>
            ) : (
              <TextComponent
                color={headerTitleColor}
                containerStyle={styles.headerTitleStandalone}
                styleProfile={'large3'}
                text={headerTitle}
              />
            )}
          </View>
          {iconArr?.length > 0 && (
            <View style={styles.iconRow}>
              {iconArr.includes('search') && (
                <Pressable style={styles.iconStyle} onPress={updateSearchStatus}>
                  <SvgSearch width={20} height={20} />
                </Pressable>
              )}
              {iconArr.includes('whiteStar') && (
                <Pressable style={styles.iconStyle} onPress={() => rightBtnClickEvent?.('star')}>
                  <SvgWhiteStar width={20} height={20} />
                </Pressable>
              )}
              {iconArr.includes('pencil') && (
                <Pressable style={styles.iconStyle} onPress={() => rightBtnClickEvent?.('edit')}>
                  <SvgPencil width={20} height={20} />
                </Pressable>
              )}
              {iconArr.includes('share') && (
                <Pressable style={styles.iconStyle} onPress={() => rightBtnClickEvent?.('share')}>
                  <SvgShare width={20} height={20} />
                </Pressable>
              )}
              {iconArr.includes('trash') && (
                <Pressable style={styles.iconStyle} onPress={() => rightBtnClickEvent?.('delete')}>
                  <SvgTrash width={20} height={20} />
                </Pressable>
              )}
              {iconArr.includes('saveBtn') && (
                <Pressable
                  style={({ pressed }) => [
                    styles.saveBtn,
                    {
                      backgroundColor: loaderStatus ? colors.backgroundColor : colors.primary,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => rightBtnClickEvent?.('save')}
                >
                  <TextComponent
                    color={loaderStatus ? colors.baseGrey : colors.baseWhite}
                    styleProfile={'large1'}
                    text={loaderStatus ? strings.saving : strings.save}
                    textAlign={'center'}
                  />
                </Pressable>
              )}
              {iconArr.includes('updateBtn') && (
                <Pressable
                  disabled={loaderStatus}
                  style={({ pressed }) => [
                    styles.saveBtn,
                    {
                      backgroundColor: loaderStatus ? colors.backgroundColor : colors.primary,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => rightBtnClickEvent?.('save')}
                >
                  <TextComponent
                    color={loaderStatus ? colors.baseGrey : colors.baseWhite}
                    styleProfile={'large1'}
                    text={loaderStatus ? strings.updating : strings.update}
                    textAlign={'center'}
                  />
                </Pressable>
              )}
              {iconArr.includes('addBtn') && (
                <Pressable
                  onPress={() => rightBtnClickEvent?.('add')}
                  style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                >
                  <SvgAdd width={15} height={15} />
                  <TextComponent
                    color={colors.primary}
                    containerStyle={styles.addBtnTextContainer}
                    styleProfile={'large1'}
                    text={strings.add}
                  />
                </Pressable>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.searchInputContainer}>
          <View style={styles.searchLeft}>
            <Pressable
              onPress={() => {
                updateSearchStatus();
                handleSearchInputChange('');
              }}
              style={styles.headerActionButton}
            >
              <SvgBackGrey />
            </Pressable>
            <TextInput
              ref={searchRef}
              placeholder={placeholder}
              selectionColor={colors.primary}
              placeholderTextColor={colors.baseMediumGrey}
              value={searchInput}
              autoFocus
              style={styles.searchInput}
              onBlur={searchBlur}
              onChangeText={handleSearchInputChange}
            />
          </View>
          {searchInput !== '' && (
            <Pressable onPress={() => handleSearchInputChange('')} style={styles.headerActionButton}>
              <SvgCross />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default NormalHeader;

const styles = StyleSheet.create({
  body: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '85%',
  },
  headerActionButton: {
    paddingHorizontal: 20,
  },
  headerTitleStandalone: {
    paddingHorizontal: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    paddingRight: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.baseGrey,
    paddingBottom: 20,
  },
  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 20,
    backgroundColor: colors.primary,
  },
  addBtnTextContainer: {
    marginLeft: 10,
  },
  addBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  searchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '87%',
  },
  searchInput: {
    color: colors.baseWhite,
    fontSize: 18,
    fontFamily: fontFamily.outfitRegular,
    paddingHorizontal: 20,
    width: '85%',
  },
  pressed: {
    opacity: 0.7,
  },
});
