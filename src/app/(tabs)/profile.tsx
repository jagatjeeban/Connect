import { View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { TextComponent } from '@/components';

/**
 * Displays the profile tab placeholder.
 */
const Profile = () => {
  return (
    <View>
      <TextComponent color={colors.baseWhite} styleProfile={'large3'} text={strings.profile} />
    </View>
  );
};

export default Profile;
