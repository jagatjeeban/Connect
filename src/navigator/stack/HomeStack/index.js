import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TabStackNavigator from "../TabStack";

//import constants
import { Colors } from "../../../common/constants";

//Contacts screen starts here
import CreateContact from "../../../screens/Contacts/CreateContact";
import ContactDetails from "../../../screens/Contacts/ContactDetails";
import SelectContacts from "../../../screens/Contacts/SelectContacts";

//Favourites screen starts here
import AddFavourites from "../../../screens/Favourites/AddFavourites";

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: Colors.BgColor
            }
        }}>
            {/* Contacts screen starts here */}
            <Stack.Screen name="Home" component={TabStackNavigator} />
            <Stack.Screen name="CreateContact" component={CreateContact} />
            <Stack.Screen name="ContactDetails" component={ContactDetails} />
            <Stack.Screen name="SelectContacts" component={SelectContacts} options={{ navigationBarHidden: true }} />

            {/* Favourites screen starts here */}
            <Stack.Screen name="AddFavourites" component={AddFavourites} options={{ navigationBarHidden: true }} />
        </Stack.Navigator>
    )
}

export default HomeStackNavigator;