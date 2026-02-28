import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { showMessage } from 'react-native-flash-message';

//import constants
import { Colors, FontFamily } from '../../common/constants';

//import components
import { PageHeader } from '../../components';

//import redux actions
import { logOutEvent } from '../../store/authSlice';

const Accounts = () => {

    //hooks
    const dispatch = useDispatch();

    //store events
    const userInfo = useSelector(state => state.auth.userInfo);
    const dash = useSelector(state => state.dash);

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

    //function to show alert for sign out confirmation
    const showConfirmationAlert = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out of Connect?',
            [
                { text: 'Cancel', onPress: () => null },
                { text: 'Sign Out', onPress: () => signOut() }
            ],
            {
                'cancelable': true,
                'userInterfaceStyle': 'dark'
            }
        )
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <PageHeader headerTitle={'Profile'} />
            <View>
                <FlatList
                    data={[1]}
                    showsVerticalScrollIndicator={false}
                    renderItem={() => {
                        return (
                            <View style={styles.mainContainer}>
                                <FastImage source={{ uri: userInfo?.user?.photo, priority: 'high' }} style={styles.contactImg} />
                                <Text style={styles.userName}>{userInfo?.user?.name}</Text>
                                <Text style={styles.userEmail}>{userInfo?.user?.email}</Text>
                                <Text style={styles.userContacts}>{dash?.contacts?.length + ' contacts'}</Text>
                                <TouchableOpacity onPress={() => showConfirmationAlert()} style={styles.signOutBtn}>
                                    <Text style={styles.signOutText}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    ItemSeparatorComponent={<View style={styles.lineSeparator} />}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: Colors.BgColor
    },
    mainContainer: {
        flex: 1,
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
        marginTop: 20
    },
    userContacts: {
        color: Colors.Base_Medium_Grey,
        fontSize: 20,
        fontFamily: FontFamily.OutfitRegular,
        marginTop: 5
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
})

export default Accounts;
