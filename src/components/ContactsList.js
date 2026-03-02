import { StyleSheet, Text, View, RefreshControl, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { FlashList } from "@shopify/flash-list";

//import constants
import { Colors, FontFamily } from '../common/constants'

//import custom functions
import { getUcFirstLetter } from '../common/helper/customFun'

//import common functions
import { sortContacts } from '../common/helper/commonFun'

//import svg files
import SvgCheck from '../assets/icons/svg/check.svg';

//import helper hooks
import { useResponsive } from '../common/helper/hooks';

const ListItemSeparator = () => <View style={styles.itemSeparator} />;

//contact item component
const ContactItem = ({ item, index, isSelectEvent, isSelected = false, onClickEvent }) => {
    return (
        <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => onClickEvent?.(item)} style={styles.contactItemContainer}>
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
            {isSelectEvent && (
                !isSelected ?
                    <View style={styles.checkBtn} />
                    :
                    <View style={styles.checkedBtn}>
                        <SvgCheck width={13} height={13} />
                    </View>
            )}
        </TouchableOpacity>
    )
}

const ContactsList = ({ contacts = [], loaderStatus = false, isSelectEvent = false, selectedContactIds = null, selectionVersion = 0, onClickContact, style = {} }) => {

    //hooks
    const { width, height } = useResponsive();

    //states
    const [groupedContacts, setGroupedContacts] = useState([]);

    //component to render the contact item
    const RenderContactItem = ({ item, index }) => {
        return (
            <ContactItem
                item={item}
                index={index}
                isSelectEvent={isSelectEvent}
                isSelected={Boolean(selectedContactIds?.has(item?.recordID))}
                onClickEvent={() => onClickContact?.(item)}
            />
        )
    }

    //contacts group item component
    const ContactGroupItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.contactGroupContainer}>
                <Text style={styles.contactInitialText}>{item?.letter}</Text>
                <FlashList
                    data={item?.contacts}
                    extraData={selectionVersion}
                    estimatedItemSize={56}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    renderItem={RenderContactItem}
                    ItemSeparatorComponent={ListItemSeparator}
                    keyExtractor={(item) => item?.recordID}
                />
            </View>
        )
    }

    //function to sort and group the contacts arrays in alphabetical order
    useEffect(() => {
        const sortedContacts = sortContacts(contacts);
        const nextGroupedContacts = [];

        for (let index = 0; index < sortedContacts.length; index += 1) {
            const currentContact = sortedContacts[index];
            const letter = getUcFirstLetter(currentContact?.displayName);
            const lastGroup = nextGroupedContacts[nextGroupedContacts.length - 1];

            if (lastGroup?.letter === letter) {
                lastGroup.contacts.push(currentContact);
                continue;
            }

            nextGroupedContacts.push({
                letter,
                contacts: [currentContact]
            });
        }

        setGroupedContacts(nextGroupedContacts);
    }, [contacts]);

    return (
        <View style={{ flex: 1, ...style }}>
            {loaderStatus ?
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={'large'} color={Colors.Primary} />
                </View>
                :
                <FlashList
                    data={groupedContacts}
                    extraData={selectionVersion}
                    estimatedItemSize={400}
                    estimatedListSize={{ width: width, height: height }}
                    nestedScrollEnabled={true}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={styles.contactsList}
                    showsVerticalScrollIndicator={false}
                    renderItem={ContactGroupItem}
                    ListFooterComponent={<View style={styles.listFooter} />}
                    ListHeaderComponent={ListItemSeparator}
                    ItemSeparatorComponent={ListItemSeparator}
                    keyExtractor={(_, index) => index.toString()}
                />
            }
        </View>
    )
}

export default ContactsList

const styles = StyleSheet.create({
    contactGroupContainer: {
        flexDirection: 'row'
    },
    contactItemContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    contactItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "87%",
    },
    contactNameText: {
        color: Colors.Base_White,
        fontSize: 18,
        fontFamily: FontFamily.OutfitRegular,
        marginLeft: 20,
        width: '75%'
    },
    contactInitialText: {
        color: Colors.Base_Medium_Grey,
        fontSize: 20,
        fontFamily: FontFamily.OutfitMedium,
        width: 40,
        marginTop: 10
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
    loaderContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: '70%',
    },
    contactsList: {
        paddingLeft: 20,
    },
    itemSeparator: {
        height: 20,
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
