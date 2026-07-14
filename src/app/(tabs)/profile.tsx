import { View } from "react-native";

//import components
import TextComponent from "@/components/core-components/text-component";

//import constants
import { colors, strings } from "@/constants";

const Profile = () => {
  return (
    <View>
      <TextComponent
        color={colors.baseWhite}
        styleProfile="large3"
        text={strings.profile}
      />
    </View>
  );
};

export default Profile;
