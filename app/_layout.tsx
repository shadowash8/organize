import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { getData, storeData } from '@/hooks/storage';
import { Directory } from 'expo-file-system';
import { Alert, BackHandler } from 'react-native';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [isReady, setIsReady] = useState(false);

    const promptUser = () => {
        Alert.alert(
            "Setup Required",
            "Please select a folder for your Org documents to continue.",
            [
                {
                    text: "Quit",
                    onPress: () => BackHandler.exitApp(), // Closes the app on Android
                    style: "cancel",
                },
                {
                    text: "Choose Folder",
                    onPress: async () => {
                        try {
                            const directory = await Directory.pickDirectoryAsync();

                            if (directory) {
                                await storeData('org_folder_uri', directory.uri);
                                setIsReady(true); // Proceed to app
                            } else {
                                promptUser(); // User dismissed picker, ask again
                            }
                        } catch (e: any) {
                            promptUser();
                        }
                    },
                },
            ],
            { cancelable: false } // Force them to choose
        );
    };

    useEffect(() => {
        const checkFolder = async () => {
            const savedPath = await getData('org_folder_uri');
            if (savedPath) {
                setIsReady(true);
            } else {
                promptUser();
            }
        };

        checkFolder();
    }, []);

    // Prevent a "flash" of the UI before the folder check is complete
    if (!isReady) {
        return null;
    }


    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
