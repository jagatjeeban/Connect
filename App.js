import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Navigator from "./src/navigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Config from "react-native-config";

//import constants
import { FontFamily, FontSize } from "./src/common/constants";

//import store and persistor
import { store, persistor } from "./src/store/store";

const App = () => {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: Config.WEB_CLIENT_ID
        });
    }, []);

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Navigator />
                    <FlashMessage
                        position={'bottom'}
                        duration={4000}
                        floating={false}
                        titleStyle={{
                            fontFamily: FontFamily.OutfitMedium,
                            fontSize: FontSize.LARGE
                        }}
                        textStyle={{
                            fontFamily: FontFamily.OutfitRegular,
                            fontSize: FontSize.XXX_NORMAL
                        }}
                    />
                </PersistGate>
            </Provider>
        </SafeAreaProvider>
    )
}

export default App;
