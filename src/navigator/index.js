import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

//import all the stacks
import AuthStackNavigator from "./stack/AuthStack";
import HomeStackNavigator from "./stack/HomeStack";

const MainStackNavigator = () => {

    const authStatus = useSelector((state) => state.auth.loginStatus);

    return (
        <NavigationContainer theme={DarkTheme}>
            {authStatus ?
                <HomeStackNavigator />
                :
                <AuthStackNavigator />
            }
        </NavigationContainer>
    )
}

export default MainStackNavigator;