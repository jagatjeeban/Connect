import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//import constants
import { Colors, FontFamily, Strings } from "../../../common/constants";

//import helper hooks
import { useResponsive } from "../../../common/helper/hooks";

//import svgs
import SvgContacts from "../../../assets/icons/svg/contacts.svg";
import SvgActiveContacts from "../../../assets/icons/svg/primaryContact.svg";
import SvgFavourites from "../../../assets/icons/svg/favourites.svg";
import SvgActiveFav from "../../../assets/icons/svg/primaryFav.svg";

//import tab screens
import Contacts from "../../../screens/Contacts";
import Favourites from "../../../screens/Favourites";
import Accounts from "../../../screens/Accounts";

const Tab = createBottomTabNavigator();

const TabOption = (props) => {
  //hooks
  const insets = useSafeAreaInsets();
  const { adaptiveSize } = useResponsive();

  //redux selectors
  const userInfo = useSelector((state) => state.auth.userInfo);

  const activeScreen = props.state.routeNames[props.state.index];
  const navigateToContacts = () => {
    props.navigation.navigate("Contacts");
  };
  const navigateToFavourites = () => {
    props.navigation.navigate("Favourites");
  };
  const navigateToAccounts = () => {
    props.navigation.navigate("Accounts");
  };

  const iconSize = adaptiveSize(5);

  return (
    <View style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={navigateToContacts}
        style={styles.tabButton}
      >
        <View
          style={[
            styles.tabIconContainer,
            activeScreen === "Contacts" && styles.activeTabIconContainer,
          ]}
        >
          {activeScreen === "Contacts" ? (
            <SvgActiveContacts width={iconSize} height={iconSize} />
          ) : (
            <SvgContacts width={iconSize} height={iconSize} />
          )}
        </View>
        <Text
          style={[
            styles.tabTitle,
            activeScreen === "Contacts"
              ? styles.activeTabTitle
              : styles.inactiveTabTitle,
          ]}
        >
          {Strings.Contacts}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={navigateToFavourites}
        style={styles.tabButton}
      >
        <View
          style={[
            styles.tabIconContainer,
            activeScreen === "Favourites" && styles.activeTabIconContainer,
          ]}
        >
          {activeScreen === "Favourites" ? (
            <SvgActiveFav width={iconSize} height={iconSize} />
          ) : (
            <SvgFavourites width={iconSize} height={iconSize} />
          )}
        </View>
        <Text
          style={[
            styles.tabTitle,
            activeScreen === "Favourites"
              ? styles.activeTabTitle
              : styles.inactiveTabTitle,
          ]}
        >
          {Strings.Favourites}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={navigateToAccounts}
        style={styles.tabButton}
      >
        <FastImage
          source={{ uri: userInfo?.user?.photo, priority: "high" }}
          style={[
            styles.profileImage,
            activeScreen === "Accounts" && styles.activeProfileImage,
          ]}
        />
        <Text
          style={[
            styles.tabTitle,
            activeScreen === "Accounts"
              ? styles.activeTabTitle
              : styles.inactiveTabTitle,
          ]}
        >
          {Strings.Profile}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const TabStackNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: Colors.BgColor }}
      tabBar={(props) => <TabOption {...props} />}
    >
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Favourites" component={Favourites} />
      <Tab.Screen name="Accounts" component={Accounts} />
    </Tab.Navigator>
  );
};

export default TabStackNavigator;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: Colors.Bg_Light,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.Base_Grey,
    paddingBottom: Platform.OS === "ios" ? 25 : 5,
    paddingTop: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabIconContainer: {
    paddingVertical: 15,
    paddingHorizontal: 17,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTabIconContainer: {
    backgroundColor: Colors.Primary_Light,
  },
  tabButton: {
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderWidth: 0,
    borderColor: Colors.Primary,
    borderRadius: 10,
  },
  activeProfileImage: {
    borderWidth: 1.5,
  },
  tabTitle: {
    fontSize: 14,
    fontFamily: FontFamily.OutfitMedium,
    marginTop: 5,
  },
  activeTabTitle: {
    color: Colors.Primary,
  },
  inactiveTabTitle: {
    color: Colors.Base_Medium_Grey,
  },
});
