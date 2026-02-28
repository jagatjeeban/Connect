import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

//import constants
import { Colors, FontFamily } from '../../common/constants';

//import components
import { HomeHeader } from '../../components';

//import svgs
import SvgPlus from '../../assets/icons/svg/plus.svg';

//import custom functions
import { getUcFirstLetter } from '../../common/helper/customFun';

//import helper hooks
import { useResponsive, useSearchFilter } from '../../common/helper/hooks';

//import common functions
import { mapDisplayContacts } from '../../common/helper/commonFun';

const Favourites = ({ navigation }) => {

  //redux selectors
  const storedContacts = useSelector((state) => state.dash.contacts);

  //hooks
  const { iconSize } = useResponsive();

  //states
  const [searchInput, setSearchInput] = useState('');

  //refs
  const refProfileSheet = useRef();

  //header component
  const Header = () => {
    return (
      <View style={styles.headerStyle}>
        <Text style={styles.favouriteText}>Favourites</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddFavourites')} activeOpacity={0.7} style={styles.addFavouriteBtn}>
          <SvgPlus width={15} height={15} />
          <Text style={styles.addFavText}>Add</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const filteredContacts = useSearchFilter(mapDisplayContacts(storedContacts), 'displayName', searchInput);

  //function to navigate to the contact details
  const navigateToDetails = (contactItem) => {
    const contactInfo = storedContacts.find(contact => contact?.recordID === contactItem?.recordID);
    if (!contactInfo) return;
    navigation.navigate('ContactDetails', { info: contactInfo });
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <HomeHeader refRBSheet={refProfileSheet} placeholder={'Search contacts'} searchEvent={setSearchInput} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Header />
        <View style={styles.favContactsContainer}>
          {filteredContacts.slice(0, 6).map((item) => {
            return (
              <TouchableOpacity key={item?.recordID} activeOpacity={0.7} onPress={() => navigateToDetails(item)} style={styles.favContactItem}>
                {item?.thumbnailPath !== '' ?
                  <FastImage source={{ uri: item?.thumbnailPath, priority: 'high' }} style={styles.favContactImage} />
                  :
                  <View style={styles.defaultContactImg}>
                    <Text style={styles.contactFirstLetter}>{getUcFirstLetter(item?.displayName)}</Text>
                  </View>
                }
                <Text style={styles.favContactName}>{item?.displayName}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Favourites;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.BgColor
  },
  addFavouriteBtn: {
    backgroundColor: Colors.Primary_Light,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10
  },
  favouriteText: {
    color: Colors.Base_White,
    fontSize: 20,
    fontFamily: FontFamily.OutfitMedium,
    fontWeight: '500'
  },
  addFavText: {
    color: Colors.Primary,
    fontSize: 16,
    fontFamily: FontFamily.OutfitMedium,
    marginLeft: 10
  },
  favContactsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 30
  },
  scrollContent: {
    paddingBottom: 130,
  },
  favContactItem: {
    alignItems: 'center',
    paddingTop: 30,
    width: '25%',
  },
  favContactImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  favContactName: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    marginTop: 15,
    textAlign: 'center',
    width: "90%"
  },
  defaultContactImg: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: Colors.Primary_Light
  },
  contactFirstLetter: {
    color: Colors.Primary,
    fontSize: 30,
    fontFamily: FontFamily.OutfitMedium
  },
})
