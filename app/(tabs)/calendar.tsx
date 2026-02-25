import { TouchableOpacity, ToastAndroid } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Calendar } from 'react-native-big-calendar';
import { getOrgItems } from '@/hooks/org-docs';
import uniOrgToCalendar from '@/hooks/uniorg-to-calendar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OrgItem } from '@/types/org';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabTwoScreen() {
    const [items, setItems] = useState<OrgItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const getItems = useCallback(async (refresh = false) => {
        setRefreshing(true);
        setItems(await getOrgItems(refresh));
        setRefreshing(false);
        if (refresh) {
            ToastAndroid.show('Refreshed', ToastAndroid.SHORT);
        }
    }, []);

    useEffect(() => {
        getItems();
    }, []);

    const events = useMemo(() => uniOrgToCalendar(items), [items]);

    return (
        <ThemedView style={{ height: "100%" }}>
            <Stack.Screen options={{
                headerRight: () => (
                    <TouchableOpacity onPress={() => getItems(true)} disabled={refreshing} style={{ marginRight: 12 }}>
                        <IconSymbol name="arrow.clockwise" size={20} color="#0a7ea4" />
                    </TouchableOpacity>
                )
            }} />

            <Calendar
                events={events}
                height={600}
                mode="schedule"
            />
        </ThemedView>
    );
}
