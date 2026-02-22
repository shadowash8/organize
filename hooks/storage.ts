import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const storeData = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e: any) {
        Alert.alert("Error in saving data", e.message);
    }
};

export const getData = async (key: string): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value == null) {
            console.warn(key, " value is null")
        }
        return value;
    } catch (e: any) {
        Alert.alert("Error in getting data", e.message);
        return null;
    }
};

export const removeData = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        Alert.alert("Storage Error", `Failed to delete ${key}: ${errorMessage}`);
    }
};
