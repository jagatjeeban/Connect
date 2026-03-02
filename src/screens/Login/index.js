import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { showMessage } from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { Colors, FontFamily, Strings } from '../../common/constants';

//import svgs
import SvgGoogleLogo from '../../assets/icons/svg/googleLogo.svg';
import SvgWelcome from '../../assets/images/svg/welcome.svg';

//import redux actions
import { loginSuccess } from '../../store/authSlice';

//import helper hooks
import { useResponsive } from '../../common/helper/hooks';

const Login = () => {

    //hooks
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const { rh } = useResponsive();

    //states
    const [loaderStatus, setLoaderStatus] = useState(false);

    //function to sign in using google credentials
    const signIn = async () => {
        setLoaderStatus(true);
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get the signed-in user and ID token
            const userInfo = await GoogleSignin.signIn();

            if (!userInfo.idToken) {
                throw new Error('Missing Google ID token');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

            // Sign-in the user with Firebase before updating local auth state
            await auth().signInWithCredential(googleCredential);
            dispatch(loginSuccess(userInfo));
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                showMessage({ message: 'Sign In failed', description: 'Something wrong happened! Please try again.', type: "danger", icon: "info" });
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                showMessage({ message: 'Please install or update the play services on your devices to be able to sign in using google!', type: "danger", icon: 'info' })
            } else {
                showMessage({ message: 'Sign In failed', description: 'Something wrong happened! Please check your internet connection.', type: "danger", icon: "info" });
                console.log('SIGN IN ERROR: ', error);
            }
        } finally {
            setLoaderStatus(false);
        }
    }

    return (
        <View style={styles.safeAreaView}>
            <View style={styles.mainContainer}>
                <View style={{ marginTop: rh(20) }}>
                    <SvgWelcome />
                </View>
                <View style={styles.welcomeTextContainer}>
                    <Text style={styles.welcomeToConnect}>{Strings.WelcomeToConnect}</Text>
                    <Text style={styles.appDescription}>{Strings.WelcomeText}</Text>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => signIn()} style={[styles.loginBtn, { bottom: insets.bottom + 20 }]}>
                    {loaderStatus ?
                        <ActivityIndicator size={'small'} color={Colors.Base_White} />
                        :
                        <>
                            <SvgGoogleLogo />
                            <Text style={styles.loginBtnText}>{Strings.ContinueWithGoogle}</Text>
                        </>
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.BgColor,
        alignItems: 'center',
        paddingHorizontal: 20
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
    welcomeTextContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    loginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: Colors.Bg_Light,
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 12,
        paddingVertical: 15,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.Base_Grey
    },
    welcomeToConnect: {
        color: Colors.Base_White,
        fontSize: 30,
        fontWeight: '500',
        fontFamily: FontFamily.OutfitMedium
    },
    appDescription: {
        color: Colors.Base_Medium_Grey,
        fontSize: 18,
        marginTop: 16,
        fontFamily: FontFamily.OutfitRegular
    },
    loginBtnText: {
        color: Colors.Base_White,
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 20,
        fontFamily: FontFamily.OutfitMedium
    },
})
