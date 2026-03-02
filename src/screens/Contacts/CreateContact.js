import { View, SafeAreaView, StyleSheet, Platform, TouchableOpacity, Image, Text, TextInput, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Contact from 'react-native-contacts';
import { showMessage } from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

//import constants
import { Colors, FontFamily, Images, Strings } from '../../common/constants';

//import system statics
import { screenDimensions } from '../../common/helper/systemStatic';

//import components
import { PageHeader, DropDown } from '../../components';

//import svgs
import SvgUpperCurve from '../../assets/images/svg/upperCurve.svg';
import SvgAddPic from '../../assets/icons/svg/addPic.svg';
import SvgUser from '../../assets/icons/svg/userIcon.svg';
import SvgCall from '../../assets/icons/svg/callGrey.svg';
import SvgMail from '../../assets/icons/svg/mailGrey.svg';
import SvgPlus from '../../assets/icons/svg/plusWhite.svg';

//import custom functions
import { getUcFirstLetterString } from '../../common/helper/customFun';

//import redux actions
import { storeContacts } from '../../store/dashSlice';

//phone number item component
const PhoneNumberItem = ({ item, index = 0, labelRef, formActionStatus = 'add', labelList = [], dropdownController, addPhoneNumberItem, removePhoneNumberItem, addIntoPhoneNumber, closeDropdown }) => {
  return (
    <View key={index}>
      <View style={[styles.width100, styles.formSection, styles.phoneFieldSection]}>
        <View style={styles.numberTitleContainer}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          {index === 0 ?
            <TouchableOpacity onPress={addPhoneNumberItem} style={styles.inlineActionRow}>
              <View style={styles.addNumberBtn}>
                <SvgPlus width={12} height={12} />
              </View>
              <Text style={styles.addNumberText}>Add</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => removePhoneNumberItem?.(index)} style={styles.inlineActionRow}>
              <Text style={[styles.addNumberText, styles.removeActionText]}>Remove</Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.inputWithIcon}>
          <SvgCall />
          <View style={styles.inputWithIconContent}>
            <TextInput
              placeholder={'Enter number'}
              value={item?.number}
              selectionColor={Colors.Primary}
              placeholderTextColor={Colors.Base_Medium_Grey}
              style={styles.inputContainer}
              keyboardType={'phone-pad'}
              onChangeText={(e) => addIntoPhoneNumber?.(e, 'number', index)}
            />
          </View>
        </View>
      </View>
      <View style={[styles.width100, styles.formSection, styles.dropdownSection]}>
        <Text style={styles.inputTitle}>Select Label</Text>
        <DropDown
          onRef={labelRef}
          dropDownList={labelList}
          isEdit={formActionStatus === 'edit' && item?.label}
          placeholder={formActionStatus === 'edit' && item?.label ? getUcFirstLetterString(item?.label) : 'Select Label'}
          dropdownController={dropdownController}
          onSelectEvent={(e) => addIntoPhoneNumber(e?.title, 'label', index)}
          closeDropdown={() => closeDropdown('dropDown1')}
          clearInput={() => null}
        />
      </View>
    </View>
  )
}

//email id item component
const EmailIdItem = ({ labelRef, formActionStatus = 'add', labelList = [], dropdownController, item, index = 0, addEmailIdItem, removeEmailIdItem, addIntoEmailId, closeDropdown }) => {
  return (
    <View key={index}>
      <View style={[styles.width100, styles.formSection, styles.phoneFieldSection]}>
        <View style={styles.numberTitleContainer}>
          <Text style={styles.inputTitle}>Email Id</Text>
          {index === 0 ?
            <TouchableOpacity onPress={addEmailIdItem} style={styles.inlineActionRow}>
              <View style={styles.addNumberBtn}>
                <SvgPlus width={12} height={12} />
              </View>
              <Text style={styles.addNumberText}>Add</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => removeEmailIdItem?.(index)} style={styles.inlineActionRow}>
              <Text style={[styles.addNumberText, styles.removeActionText]}>Remove</Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.inputWithIcon}>
          <SvgMail />
          <View style={styles.inputWithIconContent}>
            <TextInput
              placeholder={'example@gmail.com'}
              value={item?.email}
              selectionColor={Colors.Primary}
              placeholderTextColor={Colors.Base_Medium_Grey}
              style={styles.inputContainer}
              keyboardType={'email-address'}
              onChangeText={(e) => addIntoEmailId?.(e, 'email', index)}
            />
          </View>
        </View>
      </View>
      <View style={[styles.width100, styles.formSection, styles.dropdownSection]}>
        <Text style={styles.inputTitle}>Select Label</Text>
        <DropDown
          onRef={labelRef}
          dropDownList={labelList}
          isEdit={formActionStatus === 'edit'}
          placeholder={formActionStatus === 'edit' ? getUcFirstLetterString(item?.label) : 'Select Label'}
          dropdownController={dropdownController}
          onSelectEvent={(e) => addIntoEmailId?.(e?.title, 'label', index)}
          closeDropdown={() => closeDropdown?.('dropDown2')}
          clearInput={() => null}
        />
      </View>
    </View>
  )
}

const CreateContact = ({ navigation, route }) => {

  const phoneNumberObj = {
    'number': '',
    'label': ''
  }

  const emailAddressObj = {
    'email': '',
    'label': ''
  }

  const contactFormObj = {
    'displayName': '',
    'emailAddresses': [],
    'phoneNumbers': []
  };

  //hooks
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  //store events
  const storedContacts = useSelector(state => state.dash.contacts);

  //refs
  const dropdownController = useRef(null);
  const dropdownController2 = useRef(null);
  const labelRef = useRef();
  const labelRef2 = useRef();

  const labelList = [
    { id: 1, title: 'Mobile' },
    { id: 2, title: 'Work' },
    { id: 3, title: 'Home' },
    { id: 4, title: 'Other' }
  ];

  //states
  const [formValue, setFormValue] = useState(Object.assign({}, contactFormObj));
  const [phoneNumbers, setPhoneNumbers] = useState([Object.assign({}, phoneNumberObj)]);
  const [emailAddresses, setEmailAddresses] = useState([Object.assign({}, emailAddressObj)]);
  const [formActionStatus, setFormActionStatus] = useState('add');
  const [loaderStatus, setLoaderStatus] = useState(false);

  //function to close the dropdowns
  const closeDropdown = (req) => {
    req !== 'dropDown1' ? dropdownController.current.close() : null
    req !== 'dropDown2' ? dropdownController2.current.close() : null
  }

  //function to add the form values into state
  const addIntoForm = (value, name) => {
    setFormValue(formValue => ({ ...formValue, [name]: value }));
  }

  //function to add new phone number with label
  const addPhoneNumberItem = () => {
    setPhoneNumbers(prevList => [...prevList, phoneNumberObj]);
  }

  //function to add new email id with label
  const addEmailIdItem = () => {
    setEmailAddresses(prevList => [...prevList, emailAddressObj]);
  }

  //function to remove a phone number item
  const removePhoneNumberItem = (index) => {
    setPhoneNumbers(prevList => {
      let updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    })
  }

  //function to remove a email id item
  const removeEmailIdItem = (index) => {
    setEmailAddresses(prevList => {
      let updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    })
  }

  //function to add the phone number value into state
  const addIntoPhoneNumber = (value, name, index) => {
    setPhoneNumbers(prevList => {
      let updatedList = [...prevList];
      let updatedPhoneNumber = { ...updatedList[index] };
      updatedPhoneNumber[name] = value;
      updatedList[index] = updatedPhoneNumber;
      return updatedList;
    })
  }

  //function to add the email id value into state
  const addIntoEmailId = (value, name, index) => {
    setEmailAddresses(prevList => {
      let updatedList = [...prevList];
      let updatedEmail = { ...updatedList[index] };
      updatedEmail[name] = value;
      updatedList[index] = updatedEmail;
      return updatedList;
    })
  }

  //component to render the phone number item
  const RenderPhoneNumberItem = ({ item, index }) => {
    return (
      <PhoneNumberItem
        labelRef={labelRef}
        labelList={labelList}
        formActionStatus={formActionStatus}
        dropdownController={dropdownController}
        item={item}
        index={index}
        addPhoneNumberItem={addPhoneNumberItem}
        removePhoneNumberItem={removePhoneNumberItem}
        addIntoPhoneNumber={addIntoPhoneNumber}
        closeDropdown={closeDropdown}
      />
    )
  }

  //component to render the email id item
  const RenderEmailIdItem = ({ item, index }) => {
    return (
      <EmailIdItem
        labelRef={labelRef2}
        labelList={labelList}
        formActionStatus={formActionStatus}
        dropdownController={dropdownController2}
        item={item}
        index={index}
        addEmailIdItem={addEmailIdItem}
        removeEmailIdItem={removeEmailIdItem}
        addIntoEmailId={addIntoEmailId}
        closeDropdown={closeDropdown}
      />
    )
  }

  //function to format the phone number list for storing
  const getFormattedPhoneNumbers = () => {
    return phoneNumbers
      .filter(item => item?.number?.trim())
      .map(item => ({
        number: item.number.trim(),
        label: item?.label?.toLowerCase() || 'mobile'
      }));
  }

  //function to format the email list for storing
  const getFormattedEmailAddresses = () => {
    return emailAddresses
      .filter(item => item?.email?.trim())
      .map(item => ({
        email: item.email.trim(),
        label: item?.label?.toLowerCase() || 'other'
      }));
  }

  //function to create the contact payload
  const getContactPayload = () => {
    const displayName = formValue?.displayName?.trim();
    const phoneNumberList = getFormattedPhoneNumbers();
    const emailAddressList = getFormattedEmailAddresses();

    if (!displayName) {
      showMessage({ message: 'Please enter a name.', type: 'danger', icon: 'info' });
      return null;
    }

    if (phoneNumberList.length === 0) {
      showMessage({ message: 'Please add at least one phone number.', type: 'danger', icon: 'info' });
      return null;
    }

    const [givenName, ...rest] = displayName.split(/\s+/);

    return {
      displayName,
      givenName,
      familyName: rest.join(' '),
      phoneNumbers: phoneNumberList,
      emailAddresses: emailAddressList
    };
  }

  //function to save the contact
  const handleSaveContact = async (req) => {
    if (req !== 'save') return;

    const contactPayload = getContactPayload();
    if (!contactPayload) return;

    setLoaderStatus(true);

    try {
      if (formActionStatus === 'edit' && route?.params?.info?.recordID) {
        const updatedContact = {
          ...route.params.info,
          ...contactPayload,
          recordID: route.params.info.recordID
        };

        await Contact.updateContact(updatedContact);
        setLoaderStatus(false);

        const updatedContacts = storedContacts.map(item => {
          if (item?.recordID === updatedContact.recordID) {
            return updatedContact;
          }

          return item;
        });

        dispatch(storeContacts(updatedContacts));
        showMessage({ message: 'Contact updated successfully!', type: 'success', icon: 'success' });
        navigation.navigate('ContactDetails', { info: updatedContact });
        return;
      }

      const createdContact = await Contact.addContact(contactPayload);
      setLoaderStatus(false);
      dispatch(storeContacts([...storedContacts, createdContact]));
      showMessage({ message: 'Contact created successfully!', type: 'success', icon: 'success' });
      navigation.goBack();
    }
    catch (error) {
      console.log('SAVE CONTACT ERROR:', error);
      showMessage({ message: 'Unable to save contact right now.', type: 'danger', icon: 'info' });
    }
  }

  //for edit functionality
  useEffect(() => {
    if (route?.params?.reqType === 'edit') {
      setFormActionStatus('edit');
      const contactInfo = route?.params?.info;
      let formData = {};
      formData.displayName = Platform.OS === 'android' ? contactInfo?.displayName : `${contactInfo?.givenName} ${contactInfo?.familyName}`;
      formData.phoneNumbers = contactInfo?.phoneNumbers;
      formData.emailAddresses = contactInfo.emailAddresses;

      setPhoneNumbers(contactInfo?.phoneNumbers);
      setEmailAddresses(contactInfo?.emailAddresses);
      setFormValue(formData);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.upperCurveEffect}>
        <SvgUpperCurve width={screenDimensions?.width} />
      </View>
      <PageHeader
        headerTitle={formActionStatus === 'add' ? Strings.CreateContact : Strings.EditContact}
        crossBtn
        loaderStatus={loaderStatus}
        iconArr={[formActionStatus === 'add' ? 'saveBtn' : 'updateBtn']}
        rightBtnClickEvent={handleSaveContact}
        navigation={navigation}
      />
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={150} showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
        <TouchableOpacity activeOpacity={1} onPress={() => null} style={styles.avatarButton}>
          <View style={styles.userPicContainer}>
            <Image source={Images.defaultUserPic} style={styles.avatarImage} />
          </View>
          <View style={styles.addPicContainer}>
            <SvgAddPic />
            <Text style={styles.addPicText}>Add Picture</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <View style={[styles.width100, styles.nameFieldSection]}>
            <Text style={styles.inputTitle}>Name</Text>
            <View style={styles.inputWithIcon}>
              <SvgUser />
              <View style={styles.inputWithIconContent}>
                <TextInput
                  placeholder={'Enter name'}
                  value={formValue?.displayName}
                  selectionColor={Colors.Primary}
                  placeholderTextColor={Colors.Base_Medium_Grey}
                  style={styles.inputContainer}
                  onChangeText={(e) => addIntoForm(e, 'displayName')}
                />
              </View>
            </View>
          </View>
          <FlatList
            data={phoneNumbers}
            showsVerticalScrollIndicator={false}
            renderItem={RenderPhoneNumberItem}
            contentContainerStyle={styles.fieldListContent}
            keyExtractor={(_, index) => index.toString()}
          />
          <FlatList
            data={emailAddresses}
            showsVerticalScrollIndicator={false}
            renderItem={RenderEmailIdItem}
            contentContainerStyle={styles.fieldListContent}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default CreateContact;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  upperCurveEffect: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -47 : -90,
    alignSelf: 'center'
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
  addPicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  addPicText: {
    color: Colors.Base_White,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 10
  },
  actionIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 40,
    backgroundColor: Colors.Primary_Light
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 60
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
    marginVertical: 30,
    padding: 20
  },
  contactInfoText: {
    color: Colors.Base_Medium_Grey,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    marginBottom: 20
  },
  userPicContainer: {
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: Colors.Bg_Light
  },
  inputTitle: {
    color: Colors.Base_White,
    fontSize: 16,
    fontFamily: FontFamily.OutfitMedium,
    marginLeft: 40
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: 'center',
    marginTop: 10,
    width: '100%'
  },
  inputContainer: {
    backgroundColor: Colors.Bg_Light,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    color: Colors.Base_White,
    borderWidth: 1,
    borderColor: Colors.Base_Grey,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: 70
  },
  formSection: {
    marginTop: 30,
  },
  phoneFieldSection: {
    zIndex: 4,
  },
  dropdownSection: {
    zIndex: 3,
  },
  nameFieldSection: {
    zIndex: 5,
  },
  width100: {
    width: '100%'
  },
  numberTitleContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  inlineActionRow: {
    flexDirection: 'row',
    alignItems: "center",
  },
  addNumberBtn: {
    backgroundColor: Colors.Bg_Light,
    borderRadius: 6,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.Base_Grey
  },
  addNumberText: {
    color: Colors.Base_White,
    fontSize: 16,
    fontFamily: FontFamily.OutfitRegular,
    marginLeft: 10
  },
  removeActionText: {
    color: Colors.Base_Red,
  },
  inputWithIconContent: {
    marginLeft: 20,
    width: "90%",
  },
  formScrollContent: {
    paddingBottom: 100,
  },
  avatarButton: {
    alignSelf: "center",
    marginTop: 20,
  },
  avatarImage: {
    width: 60,
    height: 73,
  },
  fieldListContent: {
    paddingBottom: 5,
    paddingRight: 5,
  },
})
