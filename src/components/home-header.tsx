import { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// import { Menu, MenuItem } from 'react-native-material-menu';
import { useIsFocused } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//import constants
import { colors, fontFamily } from "@/constants";

//import svgs
import SvgBackGrey from "@/assets/icons/back-arrow-grey.svg";
import SvgCross from "@/assets/icons/cross-grey.svg";
import SvgSearch from "@/assets/icons/search.svg";

type HomeHeaderProps = {
  placeholder: string;
  menuBtn: boolean;
  selectEvent?: () => void;
  selectAllEvent?: () => void;
  searchBlur?: () => void;
  searchEvent: (req: string) => void;
};

const HomeHeader = ({
  placeholder = "Search",
  menuBtn = false,
  selectEvent,
  selectAllEvent,
  searchBlur,
  searchEvent,
}: HomeHeaderProps) => {
  //hooks
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  //states
  const [searchInput, setSearchInput] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  //function to handle system backpress
  const handleBackPress = useCallback(() => {
    if (searchStatus == true) {
      setSearchStatus(false);
      searchEvent("");
      setSearchInput("");
      return true;
    }
    return false;
  }, [searchStatus]);

  //function to handle the select event types
  const handleSelectEvent = useCallback((type?: "all") => {
    setMenuVisible(false);
    setTimeout(() => {
      if (type === "all") selectAllEvent?.();
      else selectEvent?.();
    }, 200);
  }, []);

  //function to handle the change in input value
  const handleInputChange = useCallback((input: string) => {
    searchEvent(input);
    setSearchInput(input);
  }, []);

  //function to handle the search input clear event
  const handleSearchClear = useCallback(() => {
    searchEvent("");
    setSearchInput("");
  }, []);

  useEffect(() => {
    if (isFocused) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );
      return () => backHandler.remove();
    }
  }, [searchStatus, isFocused]);

  return (
    <View
      style={[
        styles.mainContainer,
        !searchStatus && styles.mainContainerPadded,
        { paddingTop: insets.top + 10 },
      ]}
    >
      {!searchStatus ? (
        <Pressable
          onPress={() => setSearchStatus(true)}
          style={[
            styles.searchContainer,
            !menuBtn && styles.searchContainerCompact,
          ]}
        >
          <View style={styles.searchRow}>
            <SvgSearch />
            <Text style={styles.searchText}>{placeholder}</Text>
          </View>
          {/* {menuBtn === true && (
            <Menu
              visible={menuVisible}
              onRequestClose={() => setMenuVisible(false)}
              style={styles.menuContainer}
              anchor={
                <Pressable
                  hitSlop={10}
                  onPress={() => setMenuVisible(true)}
                >
                  <SvgMenu />
                </Pressable>
              }
            >
              <MenuItem
                onPress={handleSelectEvent}
                pressColor={null}
                textStyle={styles.menuItemText}
              >
                {strings.select}
              </MenuItem>
              <MenuItem
                onPress={() => handleSelectEvent("all")}
                pressColor={null}
                textStyle={styles.menuItemText}
              >
                {strings.selectAll}
              </MenuItem>
            </Menu>
          )} */}
        </Pressable>
      ) : (
        <View style={styles.activeSearchContainer}>
          <View style={styles.activeSearchLeft}>
            <Pressable
              onPress={handleBackPress}
              style={styles.searchActionButton}
            >
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
          {searchInput !== "" && (
            <Pressable
              onPress={handleSearchClear}
              style={styles.searchActionButton}
            >
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainContainerPadded: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: {
    color: colors.baseMediumGrey,
    fontSize: 16,
    fontFamily: fontFamily.outfitRegular,
    marginLeft: 10,
  },
  menuItemText: {
    color: colors.baseWhite,
    fontSize: 14,
    fontFamily: fontFamily.outfitRegular,
  },
  menuContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.baseGrey,
  },
  activeSearchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.baseGrey,
    paddingBottom: 20,
  },
  activeSearchLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "87%",
  },
  searchActionButton: {
    paddingHorizontal: 20,
  },
  searchInput: {
    color: colors.baseWhite,
    fontSize: 16,
    fontFamily: fontFamily.outfitRegular,
    width: "85%",
  },
});
