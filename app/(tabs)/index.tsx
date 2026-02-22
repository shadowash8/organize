import { ThemedView } from '@/components/themed-view';
import { getOrgItems, getOrgDocsPaths } from '@/hooks/org-docs';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { OrgItem } from '@/types/org';
import { OrgTree } from '@/components/org-tree';
import { ThemedToggle } from '@/components/themed-toggle';


export default function HomeScreen() {
    const [items, setItems] = useState<OrgItem[]>([]);
    const [paths, setPaths] = useState<string[]>([]);


    useEffect(() => {
        const load = async () => {
            const p = await getOrgDocsPaths();
            setPaths(p);

            setItems(await getOrgItems());
        };
        load();
    }, []);

    return (
        <ThemedView style={{ paddingHorizontal: 8 }}>
            <ScrollView>
                {paths.map(uri => {
                    const name = decodeURIComponent(uri).split('/').pop() ?? uri;
                    const fileItems = items.filter(i => i.sourceUri === uri);
                    return (
                        <ThemedView key={uri}>
                            <ThemedToggle key={uri} heading={name}>
                                <OrgTree items={fileItems} />
                            </ThemedToggle>
                        </ThemedView>
                    );
                })}
            </ScrollView>
        </ThemedView>
    );
}
