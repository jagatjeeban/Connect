import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

//import constants
import { Colors } from '../../common/constants';

//import themes
import { textTheme } from '../../common/themes';

//import hooks
import { useResponsive } from '../../common/helper/hooks';

const TextComponent = ({
    containerStyle = {},
    text,
    margin = null,
    required = false,
    onTextLayout = null,
    clickEvent = null,
    numOfLine = null,
    textAlign = null,
    color = null,
    customFontSize = null,
    styleProfile,
    customStyle = {},
    fontWeight = null,
    fontFamily = null,
}) => {

    const { fontSizeToRf } = useResponsive();
    const resolvedTextStyle = textTheme(styleProfile) ?? {};
    const baseFontSize = customFontSize ?? resolvedTextStyle.fontSize ?? 14;
    const resolvedFontSize = fontSizeToRf(baseFontSize);
    const resolvedFontFamily = fontFamily ?? resolvedTextStyle.fontFamily;
    const resolvedFontWeight = fontWeight ?? resolvedTextStyle.fontWeight;
    const resolvedLineHeight = customStyle?.lineHeight ?? Math.round(resolvedFontSize * 1.15); // avoid clipping descenders on some fonts

    return (
        <TouchableOpacity activeOpacity={0.7} disabled={!clickEvent} onPress={clickEvent} style={containerStyle}>
            <Text
                numberOfLines={numOfLine}
                onTextLayout={onTextLayout}
                style={{
                    textAlign: textAlign,
                    color: color ?? Colors.Base_White,
                    flexWrap: 'wrap',
                    marginVertical: margin,
                    fontSize: resolvedFontSize,
                    fontWeight: resolvedFontWeight,
                    fontFamily: resolvedFontFamily,
                    lineHeight: resolvedLineHeight,
                    ...customStyle,
                }}>
                {text}
                {required ? <Text style={{ color: Colors.Base_Red }}>{'*'}</Text> : null}
            </Text>
        </TouchableOpacity>
    );
}

export default TextComponent;
