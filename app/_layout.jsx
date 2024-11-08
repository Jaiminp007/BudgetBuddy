import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation, DrawerActions, useRoute } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, Slot, useSegments } from "expo-router";
import GlobalData from "./GlobalData";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "./services/apiHost";

const CustomHeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ paddingLeft: 10 }} // Adjust padding as needed
    >
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
};

const CustomDrawerContent = ({props}) => {
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleLogout = async () => {
    GlobalData.userid = null;
    console.log("Global Data resets")
    // Clear the auth token and credentials from memory and AsyncStorage
    navigation.navigate("index");

  };

  const handleDashboard = async () => {
    const userid = GlobalData.userid
    setUserId(GlobalData.userid);
    console.log("Username retrieved from GlobalData in _layout:", GlobalData.userid);
    console.log(userid)
    navigation.navigate("MainPage", {userId: userid})
  }
  useEffect(() => {

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          )}
          label="Dashboard"
          onPress={handleDashboard}

        />
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              color={color}
              size={size}
            />
          )}
          label="Feedback"
          onPress={() => navigation.navigate("feedback")}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          )}
          label="Logout"
          onPress={
            handleLogout
          }
        />
      </DrawerContentScrollView>
    </View>
  );
}
export default function Layout() {
  const segments = useSegments();
  const isLoginRoute = segments.length === 0 || segments[0] === "login";

  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerLeft: isLoginRoute ? null : () => <CustomHeaderLeft />,
        headerShown: !isLoginRoute, // Hide header on login route
      })}
      drawerPosition="right"  // Set drawer position to right
      drawerType="slide"      // Ensure slide type for the drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="MainPage"
        options={{
          title: null, // Remove the "MainPage" title
          headerShown: false, // Remove the entire header including the menu icon
        }}
      />
      <Drawer.Screen
        name="LandingPage"
        options={{
          title: null,
          drawerLockMode: "locked-closed", // Prevent drawer from opening
          headerShown: false, // Remove the menu icon
        }}
      />
      <Drawer.Screen
        name="ExpensePage"
        options={{
          title: null, // Remove the "MainPage" title
          headerShown: false, // Remove the entire header including the menu icon
        }}
      />
      <Drawer.Screen
        name="feedback"
        options={{
          title: "Feedback",
          headerLeft: () => <CustomHeaderLeft />,
        }}
      />
      <Drawer.Screen
        name="LoginPage"
        options={{
          title: null, // Remove the "MainPage" title
          headerShown: false, // Remove the entire header including the menu icon
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
});
