import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Calendar } from 'react-native-big-calendar';
import { getOrgItems } from '@/hooks/org-docs';
import uniOrgToCalendar from '@/hooks/uniorg-to-calendar';
import { useEffect, useMemo, useState } from 'react';
import { OrgItem } from '@/types/org';

export default function TabTwoScreen() {
    const [items, setItems] = useState<OrgItem[]>([]);

    useEffect(() => {
        const load = async () => {
            setItems(await getOrgItems());
        };
        load();
    }, []);

    const events = useMemo(() => uniOrgToCalendar(items), [items]);

    return (
        <ThemedView style={styles.titleContainer}>
            <Calendar events={events} height={600} mode="schedule" />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'column',
        gap: 8,
    },
});
