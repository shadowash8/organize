import { ThemedView } from '@/components/themed-view';
import { getOrgItems, getOrgDocsPaths } from '@/hooks/org-docs';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { OrgItem } from '@/types/org';
import { OrgTree } from '@/components/org-tree';
import { ThemedToggle } from '@/components/themed-toggle';


export default function HomeScreen() {
    const [items, setItems] = useState<OrgItem[]>([]);
    const [paths, setPaths] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setItems(await getOrgItems(true));
        setRefreshing(false);
    }, []);

    useEffect(() => {
        const load = async () => {
            const p = await getOrgDocsPaths();
            setPaths(p);

            setItems(await getOrgItems(true));
        };
        load();
    }, []);

    return (
        <ThemedView style={{ paddingHorizontal: 8 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {paths.map(uri => {
                    const file = decodeURIComponent(uri).split('/').pop() ?? uri;
                    const name = file.split('/').pop()?.replace('.org', '') ?? uri;
                    const display = name.charAt(0).toUpperCase() + name.slice(1);

                    const fileItems = items.filter(i => i.sourceUri === uri);
                    return (
                        <ThemedView key={uri}>
                            <ThemedToggle key={uri} heading={display} defaultOpen={false}>
                                <OrgTree items={fileItems} />
                            </ThemedToggle>
                        </ThemedView>
                    );
                })}
            </ScrollView>
        </ThemedView>
    );
}
