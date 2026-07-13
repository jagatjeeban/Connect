import type {
  PressableProps,
  StyleProp,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Pressable, Text } from "react-native";

//import constants
import { colors } from "@/constants";

//import themes
import textTheme, { type TextThemeName } from "@/themes/text-theme";

//import hooks
import { useResponsive } from "@/hooks";

type TextComponentProps = {
  containerStyle?: StyleProp<ViewStyle>;
  text: string;
  margin?: TextStyle["marginVertical"];
  required?: boolean;
  onTextLayout?: TextProps["onTextLayout"];
  clickEvent?: PressableProps["onPress"];
  numOfLine?: TextProps["numberOfLines"];
  textAlign?: TextStyle["textAlign"];
  color?: TextStyle["color"];
  customFontSize?: TextStyle["fontSize"];
  styleProfile?: TextThemeName;
  customStyle?: TextStyle;
  fontWeight?: TextStyle["fontWeight"];
  fontFamily?: TextStyle["fontFamily"];
};

const TextComponent = ({
  containerStyle = {},
  text,
  margin,
  required = false,
  onTextLayout,
  clickEvent,
  numOfLine,
  textAlign,
  color,
  customFontSize,
  styleProfile,
  customStyle = {},
  fontWeight,
  fontFamily,
}: TextComponentProps) => {
  const { fontSizeToRf } = useResponsive();
  const resolvedTextStyle = textTheme(styleProfile);
  const baseFontSize = customFontSize ?? resolvedTextStyle.fontSize ?? 14;
  const resolvedFontSize = fontSizeToRf(baseFontSize);
  const resolvedFontFamily = fontFamily ?? resolvedTextStyle.fontFamily;
  const resolvedLineHeight =
    customStyle?.lineHeight ?? Math.round(resolvedFontSize * 1.15); // avoid clipping descenders on some fonts

  return (
    <Pressable
      disabled={!clickEvent}
      onPress={clickEvent}
      style={containerStyle}
    >
      <Text
        numberOfLines={numOfLine}
        onTextLayout={onTextLayout}
        style={{
          textAlign: textAlign,
          color: color ?? colors.baseWhite,
          flexWrap: "wrap",
          marginVertical: margin,
          fontSize: resolvedFontSize,
          fontWeight: fontWeight,
          fontFamily: resolvedFontFamily,
          lineHeight: resolvedLineHeight,
          ...customStyle,
        }}
      >
        {text}
        {required ? (
          <Text style={{ color: colors.baseRed }}>{"*"}</Text>
        ) : null}
      </Text>
    </Pressable>
  );
};

export default TextComponent;
