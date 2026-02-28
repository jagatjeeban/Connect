import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

//import constants
import { Colors, FontFamily } from '../../common/constants';

//import components
import { PageHeader } from '../../components';

//import custom functions
import { getUcFirstLetter } from '../../common/helper/customFun';

//import svgs
import SvgFavourite from '../../assets/icons/svg/favourites.svg';
import SvgPrimaryFav from '../../assets/icons/svg/primaryFav.svg';

//import common functions
import { sortContacts } from '../../common/helper/commonFun';

const AddFavourites = ({ navigation }) => {

  const dash = useSelector((state) => state.dash);
  const isFocused = useIsFocused();

  //states
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [uniqueLetters, setUniqueLetters] = useState([]);
  const [selectedCount, setSelectedCount] = useState(null);

  //animated shared value
  const actionTabY = useSharedValue(120);

  //animated style for the bottom action tab
  const animatedTabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: actionTabY?.value }]
    }
  })

  //function to update the fav contacts list
  const updateFavContacts = (id, value) => {
    let updatedList = [...filteredContacts];
    let prevIndex = updatedList.findIndex(item => item?.recordID === id);
    if (prevIndex !== -1) {
      updatedList[prevIndex].isSelected = value;
      setSelectedCount(updatedList.filter(item => item.isSelected && item.isSelected === true)?.length);
      setFilteredContacts(updatedList);
    }
  }

  //contact item component
  const ContactItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.contactItemRow}>
        <View style={styles.contactItemContainer}>
          {item?.thumbnailPath !== '' ?
            <FastImage source={{ uri: item?.thumbnailPath, priority: 'high' }} style={styles.contactImg} />
            :
            <View style={styles.defaultContactImg}>
              <Text style={styles.contactFirstLetter}>{getUcFirstLetter(item?.displayName)}</Text>
            </View>
          }
          <Text style={styles.contactNameText}>{item?.displayName}</Text>
        </View>
        <TouchableOpacity onPress={() => updateFavContacts(item.recordID, !item?.isSelected)} style={styles.favouriteToggleBtn}>
          {item.isSelected ? <SvgPrimaryFav width={20} height={20} /> : <SvgFavourite width={20} height={20} />}
        </TouchableOpacity>
      </View>
    )
  }

  //contacts group item component
  const ContactGroupItem = ({ item: letter, index }) => {
    return (
      <View key={index} style={styles.contactGroupContainer}>
        <Text style={styles.contactInitialText}>{letter}</Text>
        <FlatList
          data={sortedContacts.filter(contact => getUcFirstLetter(contact?.displayName) === letter)}
          showsVerticalScrollIndicator={false}
          renderItem={ContactItem}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    )
  }

  useEffect(() => {
    if (isFocused) {
      let contactList = dash.contacts.map(item => {
        return {
          'recordID': item?.recordID,
          'displayName': Platform.OS === 'android' ? item?.displayName : `${item?.givenName} ${item?.familyName}`,
          'thumbnailPath': item?.thumbnailPath
        }
      });
      setContacts(contactList);
      setFilteredContacts(contactList);
    }
  }, [isFocused]);

  //sorted contacts arrays in alphabetical order
  useEffect(() => {
    setSortedContacts(sortContacts(filteredContacts));
  }, [filteredContacts]);

  //extract unique first letters from the sorted contacts array
  useEffect(() => {
    setUniqueLetters([...new Set(sortedContacts.map(contact => getUcFirstLetter(contact?.displayName)))]);
  }, [sortedContacts]);

  //function to animate the bottom action tab
  useEffect(() => {
    if (isFocused) {
      if (!filteredContacts.some(item => item.isSelected === true)) {
        actionTabY.value = withTiming(120, { duration: 300 });
      } else {
        actionTabY.value = withTiming(0, { duration: 300 });
      }
    }
  }, [isFocused, filteredContacts]);

  //function to search contacts
  const searchEvent = (req) => {
    if (req === '') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter(item => item?.displayName?.toLowerCase()?.includes(req?.toLowerCase())));
    }
  }

  //function to handle click on cancel button
  const handleClickOnCancel = () => {
    let updatedList = [...filteredContacts];
    updatedList.forEach(item => {
      if (item.isSelected) delete item?.isSelected;
    });
    actionTabY.value = withTiming(120, { duration: 300 });
    setFilteredContacts(updatedList);
    setSelectedCount(null);
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader headerTitle={selectedCount ? `${selectedCount} selected` : 'Select Contacts'} backBtn iconArr={['search']} placeholder='Search Contacts' searchEvent={(val) => searchEvent(val)} navigation={navigation} />
      <View style={styles.listContainer}>
        <FlatList
          data={uniqueLetters}
          showsVerticalScrollIndicator={false}
          renderItem={ContactGroupItem}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
          ListFooterComponent={<View style={styles.listFooter} />}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <Animated.View style={[styles.buttonContainer, animatedTabStyle]}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => handleClickOnCancel()} style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={[styles.actionBtn, styles.primaryActionBtn]}>
          <Text style={[styles.actionBtnText, styles.primaryActionBtnText]}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

export default AddFavourites;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  saveContactBtn: {
    width: "48%",
    borderRadius: 10,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  contactItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: '75%'
  },
  contactItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactNameText: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 20
  },
  contactImg: {
    width: 44,
    height: 44,
    borderRadius: 10
  },
  defaultContactImg: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.Primary_Light
  },
  contactFirstLetter: {
    color: Colors.Primary,
    fontSize: 20,
    fontFamily: FontFamily.OutfitMedium
  },
  contactInitialText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 20,
    fontWeight: '500',
    fontFamily: FontFamily.OutfitMedium,
    marginTop: 20,
    width: 40
  },
  contactGroupContainer: {
    flexDirection: 'row',
  },
  favouriteToggleBtn: {
    padding: 10,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  listFooter: {
    height: 100,
  },
  buttonContainer: {
    backgroundColor: Colors.Bg_Light,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: Colors.Base_Grey
  },
  actionBtn: {
    backgroundColor: Colors.Primary_Light,
    borderRadius: 12,
    paddingVertical: 15,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryActionBtn: {
    backgroundColor: Colors.Primary,
  },
  actionBtnText: {
    color: Colors.Primary,
    fontSize: 18,
    fontFamily: FontFamily.OutfitMedium
  },
  primaryActionBtnText: {
    color: Colors.Base_White,
  },
})
