import { ThemedView } from "@/components/themed-view";
import { getOrgItems, getOrgDocsPaths } from "@/hooks/org-docs";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { OrgItem } from "@/types/org";
import { OrgTree } from "@/components/org-tree";
import { ThemedToggle } from "@/components/themed-toggle";
import { ThemedLoader } from "@/components/themed-loader";
import { getData } from "@/hooks/storage";
import { useFocusEffect } from "expo-router";

export default function HomeScreen() {
    const [items, setItems] = useState<OrgItem[]>([]);
    const [paths, setPaths] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showDone, setShowDone] = useState(true);
    const [showNoKeyword, setShowNoKeyword] = useState(true);
    const [defaultOpen, setDefaultOpen] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getData("show_done").then((v) => {
                if (v !== null) setShowDone(v === "true");
            });
            getData("show_no_keyword").then((v) => {
                if (v !== null) setShowNoKeyword(v === "true");
            });
            getData("default_open").then((v) => {
                if (v !== null) setDefaultOpen(v === "true");
            });
        }, []),
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const p = await getOrgDocsPaths(true);
        setPaths(p);
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

    const filteredItems = (fileItems: OrgItem[]) =>
        fileItems.filter((item) => {
            if (
                !showDone &&
                (item.todoKeyword === "DONE" || item.todoKeyword === "CANC")
            )
                return false;
            if (!showNoKeyword && !item.todoKeyword) return false;
            return true;
        });

    if (refreshing) {
        return <ThemedLoader center size="large" />;
    }

    return (
        <ThemedView style={{ padding: 8, height: "100%" }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {paths.map((uri) => {
                    const file =
                        decodeURIComponent(uri).split("/").pop() ?? uri;
                    const name =
                        file.split("/").pop()?.replace(".org", "") ?? uri;
                    const display =
                        name.charAt(0).toUpperCase() + name.slice(1);
                    const fileItems = filteredItems(
                        items.filter((i) => i.sourceUri === uri),
                    );
                    return (
                        <ThemedView key={uri}>
                            <ThemedToggle
                                key={uri}
                                heading={display}
                                defaultOpen={defaultOpen}
                            >
                                <OrgTree items={fileItems} />
                            </ThemedToggle>
                        </ThemedView>
                    );
                })}
            </ScrollView>
        </ThemedView>
    );
}
