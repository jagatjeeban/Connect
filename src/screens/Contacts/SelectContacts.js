import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

//import constants
import { Colors, FontFamily, Images } from '../../common/constants';

//import components
import { PageHeader } from '../../components';

//import custom functions
import { getUcFirstLetter } from '../../common/helper/customFun';

//import svg
import SvgCheck from './../../assets/icons/svg/check.svg';

const SelectContacts = ({ navigation, route }) => {

  const isFocused = useIsFocused();

  //states
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [letters, setLetters] = useState([]);
  const [selectedCount, setSelectedCount] = useState(null);
  const [loaderStatus, setLoaderStatus] = useState(false);

  //funtion to select contacts
  const selectContacts = (id, value) => {
    let updatedList = [...contacts];
    let prevIndex = updatedList.findIndex(item => item?.recordID === id);
    if (prevIndex !== -1) {
      updatedList[prevIndex].isSelected = value;
      setContacts(updatedList);
      setSelectedCount(updatedList.filter(item => item.isSelected && item?.isSelected === true)?.length);
    }
  }

  //contact item component
  const ContactItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => selectContacts(item?.recordID, !item?.isSelected)} style={styles.contactItemContainer}>
        <View style={styles.contactItemLeft}>
          {item?.thumbnailPath !== '' ?
            <FastImage source={{ uri: item?.thumbnailPath, priority: 'high' }} style={styles.contactImg} />
            :
            <View style={styles.defaultContactImg}>
              <Text style={styles.contactFirstLetter}>{getUcFirstLetter(item?.displayName)}</Text>
            </View>
          }
          <Text style={styles.contactNameText}>{item?.displayName}</Text>
        </View>
        {!item.isSelected ?
          <View style={styles.checkBtn} />
          :
          <View style={styles.checkedBtn}>
            <SvgCheck width={13} height={13} />
          </View>
        }
      </TouchableOpacity>
    )
  }

  //contacts group item component
  const ContactGroupItem = ({ item: letter, index }) => {
    return (
      <View key={index} style={styles.contactGroupContainer}>
        <Text style={styles.contactInitialText}>{letter}</Text>
        <FlatList
          data={contacts.filter(contact => getUcFirstLetter(contact?.displayName) === letter)}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          renderItem={ContactItem}
        />
      </View>
    )
  }

  //function to get the contacts list
  const getContactList = () => {
    setLoaderStatus(true);
    let { contacts, type } = route?.params || {};
    if (!contacts) return;

    const isTypeUndefined = type === undefined;

    contacts.forEach(item => {
      if (isTypeUndefined) {
        if (item.isSelected) delete item.isSelected;
      } else {
        item.isSelected = true;
      }
    });

    if (isTypeUndefined) {
      setContacts(contacts);
    } else {
      setSelectedCount(contacts.length);
      setContacts(contacts);
    }
    setTimeout(() => setLoaderStatus(false), 50);
  }

  useEffect(() => {
    if (isFocused) {
      getContactList();
      setLetters(route?.params?.letters);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader headerTitle={selectedCount ? `${selectedCount} selected` : 'Select Contacts'} backBtn iconArr={selectedCount ? ['trash', 'share'] : null} searchEvent={(req) => searchEvent(req)} navigation={navigation} />
      <View style={styles.listContainer}>
        {loaderStatus ?
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={'large'} color={Colors.Primary} />
          </View>
          :
          <FlatList
            data={letters}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            renderItem={ContactGroupItem}
            ListFooterComponent={<View style={styles.listFooter} />}
            keyExtractor={(_, index) => index.toString()}
          />
        }
      </View>
    </SafeAreaView>
  )
}

export default SelectContacts;

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  contactNameText: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 20,
    width: '78%',
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
    width: 40,
  },
  contactItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%"
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "87%",
  },
  contactGroupContainer: {
    flexDirection: 'row',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: '90%',
  },
  listFooter: {
    height: Platform.OS === 'android' ? 230 : 200,
  },
  checkBtn: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    borderRadius: 6
  },
  checkedBtn: {
    alignItems: "center",
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: Colors.Primary
  },
})
