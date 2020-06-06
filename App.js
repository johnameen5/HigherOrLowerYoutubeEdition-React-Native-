import React, { Component } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import StartGameScreen from "./screens/StartGameScreen";
import GameScreen from "./screens/GameScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor="transparent"
          translucent={true}
        />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={StartGameScreen}
            headerMode="none"
          />
          <Stack.Screen name="Game" component={GameScreen} headerMode="none" />
        </Stack.Navigator>
      </NavigationContainer>
  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
