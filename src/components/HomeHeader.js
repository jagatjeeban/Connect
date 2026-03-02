import { View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { Colors, FontFamily, Strings } from '../common/constants';

//import svgs
import SvgSearch from '../assets/icons/svg/search.svg';
import SvgMenu from '../assets/icons/svg/menu.svg';
import SvgCross from '../assets/icons/svg/crossGrey.svg';
import SvgBackGrey from '../assets/icons/svg/backArrowGrey.svg';

const HomeHeader = ({ placeholder = 'Search', menuBtn = false, selectEvent = null, selectAllEvent = null, searchBlur = null, searchEvent }) => {

  //hooks
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  //states
  const [searchInput, setSearchInput] = useState('');
  const [searchStatus, setSearchStatus] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  //function to handle system backpress
  const handleBackPress = () => {
    if (searchStatus == true) {
      setSearchStatus(false);
      searchEvent('');
      setSearchInput('');
      return true;
    }
    return false;
  }

  //function to handle the select event types
  const handleSelectEvent = (type) => {
    setMenuVisible(false);
    setTimeout(() => {
      if (type === 'all') selectAllEvent?.();
      else selectEvent?.();
    }, 200);
  }

  useEffect(() => {
    if (isFocused) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => backHandler.remove();
    }
  }, [searchStatus, isFocused]);

  return (
    <View style={[styles.mainContainer, !searchStatus && styles.mainContainerPadded, { paddingTop: insets.top + 10 }]}>
      {!searchStatus ?
        <TouchableOpacity activeOpacity={0.7} onPress={() => setSearchStatus(true)} style={[styles.searchContainer, !menuBtn && styles.searchContainerCompact]}>
          <View style={styles.searchRow}>
            <SvgSearch />
            <Text style={styles.searchText}>{placeholder}</Text>
          </View>
          {menuBtn === true && (
            <Menu
              visible={menuVisible}
              onRequestClose={() => setMenuVisible(false)}
              style={styles.menuContainer}
              anchor={
                <TouchableOpacity hitSlop={10} activeOpacity={0.7} onPress={() => setMenuVisible(true)} >
                  <SvgMenu />
                </TouchableOpacity>
              }
            >
              <MenuItem onPress={handleSelectEvent} pressColor={null} textStyle={styles.menuItemText} >{Strings.Select}</MenuItem>
              <MenuItem onPress={() => handleSelectEvent('all')} pressColor={null} textStyle={styles.menuItemText} >{Strings.SelectAll}</MenuItem>
            </Menu>
          )}
        </TouchableOpacity>
        :
        <View style={styles.activeSearchContainer}>
          <View style={styles.activeSearchLeft}>
            <TouchableOpacity onPress={() => { setSearchStatus(false); searchEvent(''); setSearchInput(''); }} style={styles.searchActionButton}>
              <SvgBackGrey />
            </TouchableOpacity>
            <TextInput
              placeholder={placeholder}
              selectionColor={Colors.Primary}
              placeholderTextColor={Colors.Base_Medium_Grey}
              value={searchInput}
              autoFocus={true}
              style={styles.searchInput}
              onBlur={() => { if (searchBlur) searchBlur() }}
              onChange={(e) => { searchEvent(e.nativeEvent.text); setSearchInput(e.nativeEvent.text); }}
            />
          </View>
          {searchInput !== '' && (
            <TouchableOpacity onPress={() => { searchEvent(''); setSearchInput(''); }} style={styles.searchActionButton}>
              <SvgCross />
            </TouchableOpacity>
          )}
        </View>
      }
    </View>
  )
}

export default HomeHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContainerPadded: {
    paddingHorizontal: 20
  },
  searchContainer: {
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderColor: Colors.Base_Grey,
    backgroundColor: Colors.Bg_Light
  },
  searchContainerCompact: {
    paddingVertical: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 10
  },
  menuItemText: {
    color: Colors.Base_White,
    fontSize: 14,
    fontFamily: FontFamily.OutfitRegular
  },
  menuContainer: {
    backgroundColor: Colors.Bg_Light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
  },
  activeSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.Base_Grey,
  },
  activeSearchLeft: {
    flexDirection: 'row',
    alignItems: "center",
    width: "87%",
  },
  searchActionButton: {
    paddingHorizontal: 20,
  },
  searchInput: {
    color: Colors.Base_White,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    width: '85%',
  },
})
