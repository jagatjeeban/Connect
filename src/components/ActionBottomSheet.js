import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet';

//import constants
import { Colors, Strings, FontFamily } from '../common/constants'

//import components
import TextComponent from './coreComponents/TextComponent';

//import text themes
import { textThemeReq } from '../common/themes/textTheme';

//import helper hooks
import { useResponsive } from '../common/helper/hooks'

const ActionBottomSheet = ({ refRBSheet, sheetHeight, primaryTitle, secondaryTitle, primaryDescription, secondaryDescription, reqType, onClickPrimaryBtn }) => {

    //hooks
    const { adaptiveSize } = useResponsive();

    //refs
    const timeoutRef = useRef(null);

    const isValidPrimaryDesc = primaryDescription && typeof primaryDescription === 'string' && primaryDescription !== '';

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    //function to handle the primary btn click
    const handleOnClickPrimaryBtn = () => {
        refRBSheet.current?.close();

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            onClickPrimaryBtn?.();
        }, 100);
    }

    return (
        <RBSheet ref={refRBSheet} height={sheetHeight ?? adaptiveSize(60)} customStyles={{ container: styles.bottomSheet, draggableIcon: styles.pillsBarStyle }} closeOnPressBack draggable dragOnContent>
            <View style={styles.deleteTextContainer}>
                {isValidPrimaryDesc && (
                    <TextComponent
                        text={primaryDescription}
                        color={Colors.Base_White}
                        styleProfile={textThemeReq.Large2}
                        containerStyle={{ marginBottom: 20 }}
                    />
                )}
                <Text
                    style={[styles.deleteText, { color: isValidPrimaryDesc ? Colors.Base_Medium_Grey : Colors.Base_White }]}
                    numberOfLines={null}
                >
                    {secondaryDescription ?? Strings.ConfirmationMsg}
                </Text>
            </View>
            <View style={styles.actionBtnContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => refRBSheet.current?.close()} style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>{secondaryTitle ?? Strings.Cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={handleOnClickPrimaryBtn} style={[styles.actionBtn, { backgroundColor: reqType === 'delete' ? Colors.Base_Red : Colors.Primary }]}>
                    <Text style={[styles.actionBtnText, styles.primaryActionBtnText]}>{primaryTitle ?? Strings.Okay}</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    )
}

export default ActionBottomSheet

const styles = StyleSheet.create({
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
    actionBtnContainer: {
        position: "absolute",
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: '100%',
        bottom: Platform.OS === 'android' ? 20 : 50
    },
    primaryActionBtn: {
        backgroundColor: Colors.Base_Red,
    },
    primaryActionBtnText: {
        color: Colors.Base_White,
    },
})
