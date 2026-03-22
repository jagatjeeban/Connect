import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React, { useRef } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { Colors, FontFamily, Strings } from '../../common/constants';

//import components
import { PageHeader, ActionBottomSheet } from '../../components';

//import redux actions
import { logOutEvent } from '../../store/authSlice';

//import helper hooks
import { useResponsive } from '../../common/helper/hooks';

const Accounts = () => {

    //hooks
    const dispatch = useDispatch();
    const { adaptiveSize } = useResponsive();
    const insets = useSafeAreaInsets();

    //refs
    const actionSheetRef = useRef(null);

    //store events
    const userInfo = useSelector(state => state.auth.userInfo);
    const storedContacts = useSelector(state => state.dash.contacts);

    const appVersion = `v${DeviceInfo.getVersion()}`;
    const versionBottomOffset = insets.bottom + (Platform.OS === 'ios' ? 96 : 88) + 50;

    //function to sign out the user
    const signOut = async () => {
        try {
            await auth().signOut();
        } catch (error) {
            console.log('Firebase Sign Out Err', error);
            showMessage({
                message: 'Sign Out Failed',
                description: 'We could not sign you out right now. Please try again.',
                type: 'danger',
                icon: 'info'
            });
            return;
        }

        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.log('Google Sign Out Err', error);
        }

        dispatch(logOutEvent());
    }

    return (
        <View style={styles.safeAreaView}>
            <PageHeader headerTitle={Strings.Profile} />
            <View style={styles.mainContainer}>
                <View style={styles.profileContent}>
                    <FastImage source={{ uri: userInfo?.user?.photo, priority: 'high' }} style={styles.contactImg} />
                    <Text style={styles.userName}>{userInfo?.user?.name}</Text>
                    <Text style={styles.userEmail}>{userInfo?.user?.email}</Text>
                    {storedContacts?.length > 0 && (
                        <View style={styles.contactsCountContainer}>
                            <Text style={[styles.userContacts, { fontFamily: FontFamily.OutfitMedium }]}>{storedContacts?.length}</Text>
                            <Text style={styles.userContacts}>{storedContacts?.length > 1 ? 'contacts' : 'contact'}</Text>
                        </View>
                    )}
                    <TouchableOpacity activeOpacity={0.7} onPress={() => actionSheetRef.current?.open()} style={styles.signOutBtn}>
                        <Text style={styles.signOutText}>{Strings.SignOut}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.appVersionContainer, { bottom: versionBottomOffset }]}>
                    <Text style={styles.appVersionText}>{appVersion}</Text>
                </View>
            </View>
            <ActionBottomSheet
                refRBSheet={actionSheetRef}
                primaryTitle={Strings.Leave}
                secondaryTitle={Strings.Stay}
                sheetHeight={adaptiveSize(70)}
                primaryDescription={'Are you sure you want to leave?'}
                secondaryDescription={Strings.SignOutMsg}
                reqType={'delete'}
                onClickPrimaryBtn={signOut}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative'
    },
    profileContent: {
        width: '100%',
        alignItems: 'center'
    },
    headerStyle: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
    },
    favouriteText: {
        color: Colors.Base_White,
        fontSize: 20,
        fontFamily: FontFamily.OutfitMedium,
        fontWeight: '500'
    },
    userName: {
        color: Colors.Base_White,
        fontSize: 25,
        fontWeight: '500',
        fontFamily: FontFamily.OutfitMedium,
        marginTop: 20
    },
    userEmail: {
        color: Colors.Base_Medium_Grey,
        fontSize: 20,
        fontFamily: FontFamily.OutfitRegular,
    },
    userContacts: {
        color: Colors.Base_Medium_Grey,
        fontSize: 20,
        fontFamily: FontFamily.OutfitRegular,
        marginTop: 20
    },
    lineSeparator: {
        height: 1,
        backgroundColor: Colors.Base_Grey,
        marginHorizontal: 20
    },
    contactImg: {
        width: 140,
        height: 140,
        borderRadius: 30
    },
    signOutBtn: {
        marginTop: 50,
        backgroundColor: Colors.Base_Light_Red,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    signOutText: {
        color: Colors.Base_Red,
        fontSize: 20,
        fontFamily: FontFamily.OutfitMedium
    },
    contactsCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    appVersionContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute'
    },
    appVersionText: {
        color: Colors.Base_Medium_Grey,
        fontSize: 16,
        fontFamily: FontFamily.OutfitRegular,
        textAlign: 'center'
    },
})

export default Accounts;
