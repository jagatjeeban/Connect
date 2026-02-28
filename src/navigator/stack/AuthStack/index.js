import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

//import constants
import { Colors } from "../../../common/constants";

//import all auth screens
import Login from "../../../screens/Login";

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: Colors.BgColor
            }
        }}>
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    )
}

export default AuthStackNavigator;