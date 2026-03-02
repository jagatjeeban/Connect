import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//import constants
import { Colors, FontFamily, Strings } from "../common/constants";

//import svgs
import SvgBackArrow from '../assets/icons/svg/backArrow.svg';
import SvgBackGrey from '../assets/icons/svg/backArrowGrey.svg';
import SvgSearch from '../assets/icons/svg/searchWhite.svg';
import SvgCross from '../assets/icons/svg/crossGrey.svg';
import SvgCrossWhite from '../assets/icons/svg/crossWhite.svg';
import SvgWhiteStar from '../assets/icons/svg/whiteFav.svg';
import SvgPencil from '../assets/icons/svg/pencil.svg';
import SvgShare from '../assets/icons/svg/shareWhite.svg';
import SvgTrash from '../assets/icons/svg/trash.svg';
import SvgAdd from '../assets/icons/svg/plus.svg';

const NormalHeader = ({
    navigation,
    placeholder,
    backBtn,
    crossBtn,
    loaderStatus,
    headerTitle,
    headerTitleColor,
    iconArr,
    customClickEvent,
    rightBtnClickEvent,
    searchStatus,
    updateSearchStatus,
    searchBlur,
    textChangeEvent
}) => {

    //hooks
    const insets = useSafeAreaInsets();

    //states
    const [searchInput, setSearchInput] = useState('');

    //refs
    const searchRef = useRef();

    //function to handle the back press event
    const handleBackPress = () => {
        if (searchStatus) {
            updateSearchStatus();
            textChangeEvent('');
            setSearchInput('');
            return true;
        }
        return false;
    }

    useEffect(() => {
        if (searchStatus) {
            searchRef.current.focus();
        }
    }, [searchStatus]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, [searchStatus]);

    return (
        <View style={[styles.body, { paddingTop: insets.top + 10 }]}>
            {!searchStatus ?
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        {(backBtn || crossBtn) ?
                            <>
                                <TouchableOpacity onPress={() => customClickEvent ?? navigation.goBack()} style={styles.headerActionButton}>
                                    {backBtn === true && <SvgBackArrow />}
                                    {crossBtn === true && <SvgCrossWhite />}
                                </TouchableOpacity>
                                <Text style={[styles.headerTitleText, { color: headerTitleColor }]}>{headerTitle}</Text>
                            </>
                            :
                            <Text style={[styles.headerTitleText, styles.headerTitleStandalone, { color: headerTitleColor }]}>{headerTitle}</Text>
                        }
                    </View>
                    {iconArr?.length > 0 && (
                        <View style={styles.iconRow}>
                            {iconArr.some((item) => item === 'search') && (
                                <TouchableOpacity style={styles.iconStyle} onPress={updateSearchStatus}>
                                    <SvgSearch width={20} height={20} />
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'whiteStar') && (
                                <TouchableOpacity style={styles.iconStyle} onPress={() => rightBtnClickEvent('star')}>
                                    <SvgWhiteStar width={20} height={20} />
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'pencil') && (
                                <TouchableOpacity style={styles.iconStyle} onPress={() => rightBtnClickEvent('edit')}>
                                    <SvgPencil width={20} height={20} />
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'share') && (
                                <TouchableOpacity style={styles.iconStyle} onPress={() => rightBtnClickEvent('share')}>
                                    <SvgShare width={20} height={20} />
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'trash') && (
                                <TouchableOpacity style={styles.iconStyle} onPress={() => rightBtnClickEvent('delete')}>
                                    <SvgTrash width={20} height={20} />
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'saveBtn') && (
                                <TouchableOpacity activeOpacity={0.7} style={[styles.saveBtn, { backgroundColor: loaderStatus ? Colors.BgColor : Colors.Primary }]} onPress={() => rightBtnClickEvent('save')}>
                                    <Text style={[styles.saveBtnText, { color: loaderStatus ? Colors.Base_Grey : Colors.Base_White }]}>{loaderStatus ? Strings.Saving : Strings.Save}</Text>
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'updateBtn') && (
                                <TouchableOpacity activeOpacity={0.7} disabled={loaderStatus} style={[styles.saveBtn, { backgroundColor: loaderStatus ? Colors.BgColor : Colors.Primary }]} onPress={() => rightBtnClickEvent('save')}>
                                    <Text style={[styles.saveBtnText, { color: loaderStatus ? Colors.Base_Grey : Colors.Base_White }]}>{loaderStatus ? Strings.Updating : Strings.Update}</Text>
                                </TouchableOpacity>
                            )}
                            {iconArr.some((item) => item === 'addBtn') && (
                                <TouchableOpacity onPress={() => rightBtnClickEvent('add')} activeOpacity={0.7} style={styles.addBtn}>
                                    <SvgAdd width={15} height={15} />
                                    <Text style={styles.addBtnText}>{Strings.Add}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
                :
                <View style={styles.searchInputContainer}>
                    <View style={styles.searchLeft}>
                        <TouchableOpacity
                            onPress={() => {
                                updateSearchStatus();
                                textChangeEvent('');
                                setSearchInput('');
                            }}
                            style={styles.headerActionButton}
                        >
                            <SvgBackGrey />
                        </TouchableOpacity>
                        <TextInput
                            ref={searchRef}
                            placeholder={placeholder}
                            selectionColor={Colors.Primary}
                            placeholderTextColor={Colors.Base_Medium_Grey}
                            value={searchInput}
                            autoFocus={true}
                            style={styles.searchInput}
                            onBlur={searchBlur}
                            onChange={(e) => { textChangeEvent(e.nativeEvent.text); setSearchInput(e.nativeEvent.text); }}
                        />
                    </View>
                    {searchInput !== '' && (
                        <TouchableOpacity onPress={() => { textChangeEvent(''); setSearchInput(''); }} style={styles.headerActionButton}>
                            <SvgCross />
                        </TouchableOpacity>
                    )}
                </View>
            }
        </View>
    )
}

const PageHeader = ({
    navigation,
    placeholder = 'Search',
    loaderStatus = false,
    headerType = 'normalHeader',
    headerTitle = null,
    headerTitleColor = Colors.Base_White,
    iconArr = [],
    backBtn = false,
    crossBtn = false,
    customClickEvent = null,
    rightBtnClickEvent = null,
    searchBlur = null,
    searchEvent = null
}) => {
    const [searchStatus, setSearchStatus] = useState(false);
    return (
        <>
            {headerType === 'normalHeader' && (
                <NormalHeader
                    navigation={navigation}
                    headerTitle={headerTitle}
                    headerTitleColor={headerTitleColor}
                    placeholder={placeholder}
                    loaderStatus={loaderStatus}
                    backBtn={backBtn}
                    crossBtn={crossBtn}
                    iconArr={iconArr}
                    customClickEvent={customClickEvent}
                    rightBtnClickEvent={rightBtnClickEvent}
                    searchStatus={searchStatus}
                    textChangeEvent={searchEvent}
                    searchBlur={searchBlur}
                    updateSearchStatus={() => setSearchStatus(status => !status)}
                />
            )}
        </>
    )
}

export default PageHeader;

const styles = StyleSheet.create({
    body: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: "85%",
    },
    headerActionButton: {
        paddingHorizontal: 20,
    },
    headerTitleContainer: {
        paddingVertical: 20,
    },
    headerTitleText: {
        fontSize: 20,
        fontFamily: FontFamily.OutfitMedium,
    },
    headerTitleStandalone: {
        paddingHorizontal: 20,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        paddingRight: 20
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: Colors.Base_Grey,
    },
    saveBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 20,
        backgroundColor: Colors.Primary
    },
    saveBtnText: {
        color: Colors.Base_White,
        fontSize: 16,
        fontFamily: FontFamily.OutfitMedium,
    },
    addBtnText: {
        color: Colors.Primary,
        fontSize: 16,
        fontFamily: FontFamily.OutfitMedium,
        marginLeft: 10
    },
    addBtn: {
        backgroundColor: Colors.Primary_Light,
        borderRadius: 6,
        paddingVertical: 7,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginRight: 20
    },
    searchLeft: {
        flexDirection: 'row',
        alignItems: "center",
        width: "87%",
    },
    searchInput: {
        color: Colors.Base_White,
        fontSize: 18,
        fontFamily: FontFamily.OutfitRegular,
        paddingHorizontal: 20,
        width: '85%',
    },
})
