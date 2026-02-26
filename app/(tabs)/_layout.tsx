import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                    elevation: 0,
                    borderBottomWidth: 0,
                    shadowOpacity: 0
                },
                headerTintColor: Colors[colorScheme ?? "light"].tint,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                },
                tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Calendar",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="calendar.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="gear.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
