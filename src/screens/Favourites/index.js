import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

//import constants
import { Colors, FontFamily } from '../../common/constants';

//import components
import { HomeHeader } from '../../components';

//import svgs
import SvgPlus from '../../assets/icons/svg/plus.svg';
import SvgFavourite from '../../assets/icons/svg/favourites.svg';
import SvgSearch from '../../assets/icons/svg/search.svg';

//import custom functions
import { getUcFirstLetter } from '../../common/helper/customFun';

//import helper hooks
import { useSearchFilter } from '../../common/helper/hooks';

//import common functions
import { mapDisplayContacts } from '../../common/helper/commonFun';

//favourites header component
const FavouritesHeader = ({ onPressAdd }) => {
  return (
    <View style={styles.headerStyle}>
      <Text style={styles.favouriteText}>Favourites</Text>
      <TouchableOpacity onPress={onPressAdd} activeOpacity={0.7} style={styles.addFavouriteBtn}>
        <SvgPlus width={15} height={15} />
        <Text style={styles.addFavText}>Add</Text>
      </TouchableOpacity>
    </View>
  )
}

//empty state component
const EmptyState = ({ isSearchResultState = false }) => {
  const title = isSearchResultState ? 'No results found' : 'No favourites yet';
  const description = isSearchResultState
    ? 'Try a different name or clear your search to see your favourites again.'
    : 'Add your go-to people to favourites so they are easier to reach from here.';

  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconWrapper}>
        {isSearchResultState ? (
          <SvgSearch width={34} height={34} />
        ) : (
          <SvgFavourite width={34} height={30} />
        )}
      </View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDescription}>{description}</Text>
    </View>
  );
}

const Favourites = ({ navigation }) => {

  //redux selectors
  const storedContacts = useSelector((state) => state.dash.contacts);

  //states
  const [searchInput, setSearchInput] = useState('');

  const displayContacts = useMemo(
    () => mapDisplayContacts(storedContacts),
    [storedContacts]
  );
  const filteredContacts = useSearchFilter(displayContacts, 'displayName', searchInput);
  const visibleContacts = filteredContacts.slice(0, 6);
  const hasSearchQuery = searchInput.trim().length > 0;
  const showSearchEmptyState = visibleContacts.length === 0 && hasSearchQuery && displayContacts.length > 0;

  //function to navigate to the contact details
  const navigateToDetails = (contactItem) => {
    const contactInfo = storedContacts.find(contact => contact?.recordID === contactItem?.recordID);
    if (!contactInfo) return;
    navigation.navigate('ContactDetails', { info: contactInfo });
  }

  return (
    <View style={styles.safeAreaView}>
      <HomeHeader
        placeholder={'Search contacts'}
        searchEvent={setSearchInput}
      />
      <FavouritesHeader onPressAdd={() => navigation.navigate('AddFavourites')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {visibleContacts.length > 0 ? (
          <View style={styles.favContactsContainer}>
            {visibleContacts.map((item) => {
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
        ) : (
          <EmptyState isSearchResultState={showSearchEmptyState} />
        )}
      </ScrollView>
    </View>
  )
}

export default Favourites;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
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
    paddingVertical: 20
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
    flexGrow: 1,
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
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 110
  },
  emptyStateIconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Bg_Light,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    marginBottom: 20
  },
  emptyStateTitle: {
    color: Colors.Base_White,
    fontSize: 22,
    fontFamily: FontFamily.OutfitMedium,
    textAlign: 'center'
  },
  emptyStateDescription: {
    marginTop: 10,
    color: Colors.Base_Medium_Grey,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.OutfitRegular,
    textAlign: 'center',
    maxWidth: 300
  },
})
