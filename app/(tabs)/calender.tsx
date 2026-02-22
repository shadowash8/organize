import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
    return (
        <ThemedView style={styles.titleContainer}>
            <ThemedText
                type="title"
                style={{
                    fontFamily: Fonts.rounded,
                }}>
                Calender
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
