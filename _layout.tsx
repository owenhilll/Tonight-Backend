import Profile from "@/app/profile";
import { IsBusiness } from "@/context/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
export default function TabLayout() {
  if (IsBusiness) return <Profile />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "top",
        tabBarActiveBackgroundColor: "#2a97f0",
        tabBarLabelStyle: {
          color: "white",
          fontSize: 14,
        },

        tabBarStyle: {
          backgroundColor: "#141414",
          borderBottomColor: "#2a97f0",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Near",
          tabBarIcon: () => (
            <Ionicons name="pin-sharp" size={18} color={"white"} />
          ),
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          title: "Following",
          tabBarIcon: () => (
            <Ionicons name="person" size={12} color={"white"} />
          ),
        }}
      />
    </Tabs>
  );
}
