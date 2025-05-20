import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Image, StyleSheet, View, Text } from 'react-native';

import HomeScreen from './HomeScreen';
import AddProductScreen from './AddProductScreen';
import CheckoutScreen from './CheckoutScreen';
import SplashScreen from './SplashScreen';


import logo from './assets/logoRapidKitchen.png';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
 
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 8,
  },
  // Style for the 'Rapid Kitchen' text in the header
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

// Define the custom header component function
// This function will be used for the headerTitle option on each screen
const CustomHeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Image
      style={styles.headerLogo}
      source={logo}
    />
    <Text style={styles.headerTitleText}>Rapid Kitchen</Text>
  </View>
);


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

     
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
           
            headerTitle: CustomHeaderTitle,
           
            headerTitleAlign: 'left',
            // You can keep a 'title' here if needed for accessibility or other purposes,
            // but headerTitle visually overrides it.
            // title: 'Rapid Kitchen',
          }}
        />

        {/* Add Product Screen Configuration */}
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            // Use the CustomHeaderTitle component for the header
            headerTitle: CustomHeaderTitle,
            // Align the custom header content
            headerTitleAlign: 'left',
            // Keep other specific options for this screen
            title: '🍴 Add a Meal', // Keep the text title as well
            headerBackTitleVisible: false,
          }}
        />

        {/* Checkout Screen Configuration */}
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            // Use the CustomHeaderTitle component for the header
            headerTitle: CustomHeaderTitle,
            // Align the custom header content
            headerTitleAlign: 'left',
            // Keep other specific options for this screen
            title: 'Order Details', // Keep the text title as well
            headerBackTitleVisible: false,
            headerLeft: ({ navigation }) => null, // This hides the back button
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}