//import constants
import { FontFamily, FontSize } from "../constants";

//function to create text theme
const createTextTheme = (fontSize, fontFamily) => ({
    fontSize,
    fontFamily
});

//text theme required strings
export const textThemeReq = {
    Largest3: 'Largest3',
    Largest2: 'Largest2',
    Largest1: 'Largest1',
    Bigger2: 'Bigger2',
    Bigger1: 'Bigger1',
    Large4: 'Large4',
    Large3: 'Large3',
    Large2: 'Large2',
    Large1: 'Large1',
    Normal4: 'Normal4',
    Normal3: 'Normal3',
    Normal2: 'Normal2',
    Normal1: 'Normal1',
    Small4: 'Small4',
    Small3: 'Small3',
    Small2: 'Small2',
    Small1: 'Small1',
    Small0: 'Small0'
}

const defaultTextStyle = createTextTheme(FontSize.XXX_NORMAL, FontFamily.OutfitRegular);

const textStyleMap = {
    [textThemeReq.Largest3]: createTextTheme(FontSize.XXX_LARGEST, FontFamily.OutfitBold),
    [textThemeReq.Largest2]: createTextTheme(FontSize.X_LARGEST, FontFamily.OutfitBold),
    [textThemeReq.Largest1]: createTextTheme(FontSize.LARGEST, FontFamily.OutfitBold),
    [textThemeReq.Bigger2]: createTextTheme(FontSize.X_Bigger, FontFamily.OutfitSemiBold),
    [textThemeReq.Bigger1]: createTextTheme(FontSize.Bigger, FontFamily.OutfitSemiBold),
    [textThemeReq.Large4]: createTextTheme(FontSize.XXXX_LARGE, FontFamily.OutfitMedium),
    [textThemeReq.Large3]: createTextTheme(FontSize.XXX_LARGE, FontFamily.OutfitMedium),
    [textThemeReq.Large2]: createTextTheme(FontSize.X_LARGE, FontFamily.OutfitMedium),
    [textThemeReq.Large1]: createTextTheme(FontSize.LARGE, FontFamily.OutfitMedium),
    [textThemeReq.Normal4]: createTextTheme(FontSize.XXX_NORMAL, FontFamily.OutfitRegular),
    [textThemeReq.Normal3]: createTextTheme(FontSize.XX_NORMAL, FontFamily.OutfitRegular),
    [textThemeReq.Normal2]: createTextTheme(FontSize.X_NORMAL, FontFamily.OutfitRegular),
    [textThemeReq.Normal1]: createTextTheme(FontSize.NORMAL, FontFamily.OutfitRegular),
    [textThemeReq.Small4]: createTextTheme(FontSize.XX_SMALL, FontFamily.OutfitRegular),
    [textThemeReq.Small3]: createTextTheme(FontSize.X_SMALL, FontFamily.OutfitRegular),
    [textThemeReq.Small2]: createTextTheme(FontSize.SMALL, FontFamily.OutfitRegular),
    [textThemeReq.Small1]: createTextTheme(FontSize.X_TINY, FontFamily.OutfitRegular),
    [textThemeReq.Small0]: createTextTheme(FontSize.TINY, FontFamily.OutfitRegular)
};

//function to get the text style
const textTheme = (req) => textStyleMap[req] ?? defaultTextStyle;

export default textTheme;