import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Colors, FontFamily } from "../../common/constants";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import SvgArrowDown from '../../assets/icons/svg/arrowDown.svg';

const DropDown = ({ dropDownList, closeDropdown, placeholder = null, isEdit = false, clearInput, initialValue, loaderStatus, name = "", errorStatus = "", onRef, onSelectEvent, dropdownController }) => {
    return (
        <AutocompleteDropdown
            controller={(controller) => {
                dropdownController.current = controller;
            }}
            containerStyle={styles.dropdownContainer}
            position={'relative'}
            onChevronPress={() => closeDropdown ? closeDropdown() : null}
            onOpenSuggestionsList={(e) => e ? closeDropdown() : null}
            closeOnSubmit={true}
            closeOnBlur={false}
            useFilter={false}
            clearOnFocus={true}
            showClear={false}
            textInputProps={{
                style: styles.textInputProps,
                placeholder: placeholder,
                selectionColor: Colors.Primary,
                placeholderTextColor: isEdit ? Colors.Base_White : Colors.Base_Medium_Grey,
            }}
            ChevronIconComponent={<SvgArrowDown />}
            direction={"down"}
            ref={onRef}
            onBlur={() => { console.log("=============>") }}
            onClear={() => clearInput ? clearInput() : null}
            EmptyResultComponent={<View style={styles.emptyResultContainer}><Text style={styles.emptyResultText}>No Options</Text></View>}
            renderItem={(item, index) =>
                <View key={index} style={styles.dropdownItemContainer}>
                    <Text style={styles.dropdownItemText}>{item.title}</Text>
                </View>
            }
            suggestionsListContainerStyle={styles.suggestionContainer}
            initialValue={initialValue}
            onSelectItem={(e) => onSelectEvent(e)}
            loading={loaderStatus}
            inputContainerStyle={styles.inputContainer}
            dataSet={dropDownList}
            flatListProps={{
                style: styles.dropdownList,
                ItemSeparatorComponent: <View />
            }}
        />
    );
}

export default DropDown;

const styles = StyleSheet.create({
    dropdownContainer: {
        marginBottom: -7,
        fontFamily: FontFamily.OutfitRegular,
    },
    textInputProps: {
        color: Colors.Base_White,
        fontWeight: '400',
        fontSize: 16,
        paddingLeft: 10,
        paddingVertical: 7,
        fontFamily: FontFamily.OutfitRegular,
    },
    inputContainer: {
        marginLeft: 40,
        marginTop: 10,
        width: 160,
        backgroundColor: Colors.Bg_Light,
        borderWidth: 1,
        borderColor: Colors.Base_Grey,
        borderRadius: 12,
        top: -4,
        padding: Platform.OS === 'android' ? 3 : null,
    },
    suggestionContainer: {
        backgroundColor: Colors.Bg_Light,
        borderRadius: 12,
        width: 160,
        marginLeft: 40,
        marginVertical: 15,
    },
    emptyResultContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    emptyResultText: {
        fontFamily: FontFamily.OutfitRegular,
        color: Colors.Base_White,
        backgroundColor: Colors.Bg_Light,
    },
    dropdownItemContainer: {
        zIndex: 1000,
        borderRadius: 12,
        backgroundColor: Colors.Bg_Light,
    },
    dropdownItemText: {
        fontFamily: FontFamily.OutfitRegular,
        color: Colors.Base_White,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
    dropdownList: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.Base_Grey,
    },
});
