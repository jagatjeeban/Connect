import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

//import all auth screens
import Login from "../../../screens/Login";

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            gestureEnabled: false
        }}>
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    )
}

export default AuthStackNavigator;