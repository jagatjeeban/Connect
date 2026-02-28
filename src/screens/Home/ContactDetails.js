import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, FlatList, Platform, Linking } from 'react-native'
import React, { useRef, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import Contact from 'react-native-contacts';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';

//import constants
import { Colors, FontFamily, Strings } from '../../common/constants';

//import system statics
import { screenDimensions } from '../../common/helper/systemStatic';

//import common functions
import { openCallApp, openMailApp, openMessagingApp, shareContact } from '../../common/helper/commonFun';

//import components
import { PageHeader } from '../../components';

//import custom functions
import { getUcFirstLetterString, getUcFirstLetter } from '../../common/helper/customFun';

//import svgs
import SvgUpperCurve from '../../assets/images/svg/upperCurve.svg';
import SvgCall from '../../assets/icons/svg/call.svg';
import SvgMessage from '../../assets/icons/svg/message.svg';
import SvgMail from '../../assets/icons/svg/mail.svg';
import SvgShare from '../../assets/icons/svg/share.svg';
import SvgCallWhite from '../../assets/icons/svg/callWhite.svg';
import SvgTrash from '../../assets/icons/svg/trash.svg';

//import redux slice
import { storeContacts } from '../../store/dashSlice';

//delete number bottomsheet component
const DeleteNumberSheet = ({ refRBSheet, onClickDelete = null }) => {
  return (
    <RBSheet ref={refRBSheet} height={Platform.OS === 'ios' ? 250 : 230} customStyles={{ container: styles.bottomSheet, draggableIcon: styles.pillsBarStyle }} closeOnPressBack draggable dragOnContent>
      <View style={styles.deleteTextContainer}>
        <Text style={styles.deleteText} numberOfLines={null}>{Strings.DeleteNumberText}</Text>
      </View>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => refRBSheet.current?.close()} style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>No, Keep it!</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={onClickDelete} style={[styles.actionBtn, styles.primaryActionBtn]}>
          <Text style={[styles.actionBtnText, styles.primaryActionBtnText]}>Yes, Delete!</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  )
}

const ContactDetails = ({ navigation, route }) => {

  //hooks
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  //redux selectors
  const storedContacts = useSelector(state => state.dash.contacts);

  //refs
  const deleteSheetRef = useRef();

  //states
  const [contactInfo, setContactInfo] = useState(route?.params?.info);

  useEffect(() => {
    if (route?.params?.info) {
      setContactInfo(route.params.info);
    }
  }, [route?.params?.info]);

  //contact info item component
  const ContactInfoItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.contactInfoRow}>
        <View style={styles.contactInfoIconContainer}>
          <SvgCallWhite />
        </View>
        <View style={styles.contactInfoTextContainer}>
          <Text style={styles.mobileNumber}>{item?.number}</Text>
          <Text style={styles.contactLabel}>{getUcFirstLetterString(item?.label)}</Text>
        </View>
      </View>
    )
  }

  //function to delete the contact
  const deleteContact = () => {
    deleteSheetRef.current.close();
    Contact.deleteContact({ recordID: contactInfo?.recordID })
      .then(() => {
        const updatedContacts = [...storedContacts];
        const index = updatedContacts.findIndex(contact => contact?.recordID === contactInfo?.recordID);
        if (index === -1) return;
        updatedContacts.splice(index, 1);
        dispatch(storeContacts(updatedContacts));
        navigation.pop();
        showMessage({ message: 'Contact deleted successfully!', type: 'danger', icon: 'success' });
      })
      .catch((error) => {
        console.log('Contact Delete Err', error);
      })
  }

  //function to remove duplicate phone numbers
  const removeDuplicateNumbers = (arr) => {
    const uniqueNumbers = new Set();
    return arr?.reduce((info, current) => {
      const newNumber = current.number.replace(/\s+/g, '');
      if (!uniqueNumbers.has(newNumber)) {
        uniqueNumbers.add(newNumber);
        info.push(current);
      }
      return info;
    }, []);
  };

  //function to perform contact actions
  const actionClickEvent = (req) => {
    if (req === 'edit') {
      navigation.navigate('CreateContact', { 'info': contactInfo, 'reqType': 'edit' });
    }
  }

  useEffect(() => {
    if (isFocused && Platform.OS === 'android') {
      StatusBar.setBackgroundColor(Colors.Base_Dark_Black);
      return () => StatusBar.setBackgroundColor(Colors.BgColor);
    }
  }, [isFocused]);

  const phoneNumbers = removeDuplicateNumbers(contactInfo?.phoneNumbers) ?? [];

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.upperCurveEffect}>
        <SvgUpperCurve width={screenDimensions?.width} />
      </View>
      <PageHeader backBtn iconArr={['whiteStar', 'pencil']} rightBtnClickEvent={(req) => actionClickEvent(req)} navigation={navigation} />
      <FlatList
        data={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={() => {
          return (
            <View>
              <View style={styles.contactHeaderContainer}>
                {contactInfo?.thumbnailPath && contactInfo?.thumbnailPath !== '' ?
                  <FastImage source={{ uri: contactInfo?.thumbnailPath }} style={styles.contactImg} />
                  :
                  <View style={styles.defaultContactImg}>
                    <Text style={styles.contactFirstLetter}>{getUcFirstLetter(Platform.OS === 'android' ? contactInfo?.displayName : contactInfo?.givenName)}</Text>
                  </View>
                }
                <Text style={styles.contactName}>{Platform.OS === 'android' ? contactInfo?.displayName : `${contactInfo?.givenName} ${contactInfo?.familyName}`}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => openCallApp(contactInfo?.phoneNumbers[0]?.number)} style={styles.actionTouchTarget}>
                  <View style={styles.actionIconContainer}>
                    <SvgCall />
                  </View>
                  <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => openMessagingApp(contactInfo?.phoneNumbers[0]?.number)} style={styles.actionTouchTarget}>
                  <View style={styles.actionIconContainer}>
                    <SvgMessage />
                  </View>
                  <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
                {contactInfo?.emailAddresses?.length > 0 ?
                  <TouchableOpacity activeOpacity={0.7} onPress={() => openMailApp(contactInfo?.emailAddresses[0]?.email)} style={styles.actionTouchTarget}>
                    <View style={styles.actionIconContainer}>
                      <SvgMail />
                    </View>
                    <Text style={styles.actionText}>Email</Text>
                  </TouchableOpacity>
                  : null}
                <TouchableOpacity activeOpacity={0.7} onPress={() => shareContact(contactInfo)} style={styles.actionTouchTarget}>
                  <View style={styles.actionIconContainer}>
                    <SvgShare />
                  </View>
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contactInfoContainer}>
                <Text style={styles.contactInfoText}>Contact Info</Text>
                <FlatList
                  data={phoneNumbers}
                  showsVerticalScrollIndicator={false}
                  renderItem={ContactInfoItem}
                  ItemSeparatorComponent={<View style={styles.contactInfoSeparator} />}
                  keyExtractor={(_, index) => index.toString()}
                />
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => deleteSheetRef.current.open()} style={styles.deleteContactBtn}>
                <SvgTrash width={18} height={18} />
                <Text style={styles.deleteContactText}>Delete contact</Text>
              </TouchableOpacity>
            </View>
          )
        }}
        keyExtractor={(_, index) => index.toString()}
      />
      <DeleteNumberSheet
        refRBSheet={deleteSheetRef}
        onClickDelete={deleteContact}
      />
    </SafeAreaView>
  )
}

export default ContactDetails;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  upperCurveEffect: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -47 : -90,
    alignSelf: 'center'
  },
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.Base_Grey,
    backgroundColor: Colors.Bg_Light
  },
  pillsBarStyle: {
    width: 80,
    height: 3.5,
    marginVertical: 20,
    borderRadius: 40,
    backgroundColor: Colors.Base_Grey
  },
  contactInfoRow: {
    flexDirection: 'row',
  },
  contactInfoIconContainer: {
    marginTop: 5,
  },
  contactInfoTextContainer: {
    marginLeft: 20,
  },
  primaryActionBtn: {
    backgroundColor: Colors.Base_Red,
  },
  primaryActionBtnText: {
    color: Colors.Base_White,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  contactHeaderContainer: {
    alignItems: 'center',
  },
  actionTouchTarget: {
    alignItems: "center",
  },
  contactInfoSeparator: {
    backgroundColor: Colors.Base_Grey,
    height: 1,
    marginVertical: 15,
  },
  deleteContactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
  },
  deleteContactText: {
    color: Colors.Base_Red,
    fontSize: 16,
    fontFamily: FontFamily.OutfitMedium,
    marginLeft: 15,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20
  },
  inputStyle: {
    borderColor: 'black',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    color: 'black'
  },
  saveContactBtn: {
    width: "48%",
    borderRadius: 10,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  actionIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 60,
    backgroundColor: Colors.Primary_Light
  },
  actionBtnContainer: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: '100%'
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 40,
  },
  actionText: {
    color: Colors.Base_White,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    marginTop: 15
  },
  contactInfoContainer: {
    backgroundColor: Colors.Bg_Light,
    borderRadius: 22,
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20
  },
  contactInfoText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 16,
    fontFamily: FontFamily.OutfitMedium,
    fontWeight: '500',
    marginBottom: 20
  },
  actionBtn: {
    backgroundColor: Colors.Primary_Light,
    borderRadius: 12,
    paddingVertical: 15,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionBtnText: {
    color: Colors.Primary,
    fontSize: 18,
    fontFamily: FontFamily.OutfitMedium
  },
  deleteTextContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Bg_Light
  },
  deleteText: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular,
    textAlign: 'center'
  },
  mobileNumber: {
    color: Colors.Base_White,
    fontSize: 18,
    fontFamily: FontFamily.OutfitRegular
  },
  contactName: {
    color: Colors.Base_White,
    fontSize: 22,
    fontFamily: FontFamily.OutfitRegular,
    marginTop: 20
  },
  contactLabel: {
    color: Colors.Base_Medium_Grey,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular
  },
  contactImg: {
    width: 140,
    height: 140,
    borderRadius: 30
  },
  defaultContactImg: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: Colors.Primary
  },
  contactFirstLetter: {
    color: Colors.Base_White,
    fontSize: 50,
    fontFamily: FontFamily.OutfitMedium
  },
})
