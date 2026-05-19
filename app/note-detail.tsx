import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedLoader } from "@/components/themed-loader";
import { useThemeColor } from "@/hooks/use-theme-color";
import { readOrgFile, extractItems } from "@/hooks/org-docs";
import { OrgItem } from "@/types/org";
import { NoteTree } from "@/components/note-tree";
import { unified } from "unified";
import parse from "uniorg-parse";

interface NoteHead {
    title: string;
    filetags: string[];
}

function extractFileKeywords(ast: any): Record<string, string> {
    const kw: Record<string, string> = {};
    for (const node of ast.children ?? []) {
        if (node.type === "keyword") {
            kw[node.key?.toUpperCase()] = node.value ?? "";
        }
    }
    return kw;
}

export default function NoteDetailScreen() {
    const { uri } = useLocalSearchParams<{ uri: string }>();
    const [items, setItems] = useState<OrgItem[]>([]);
    const [head, setHead] = useState<NoteHead>({ title: "", filetags: [] });
    const [loading, setLoading] = useState(true);

    const tagBg = useThemeColor({}, "background");
    const tagText = useThemeColor({}, "text");

    useEffect(() => {
        let isMounted = true;
        async function fetchNote() {
            if (!uri) return;
            try {
                setLoading(true);
                const content = await readOrgFile(uri);

                const ast = unified()
                    .use(parse, {
                        todoKeywords: ["TODO", "WORKING", "WAIT", "IDEA", "DONE", "CANC"],
                    })
                    .parse(content) as any;

                const keywords = extractFileKeywords(ast);
                const filename = decodeURIComponent(uri).split("/").pop() ?? uri;
                const title = keywords["TITLE"] ?? filename.replace(/\.org$/i, "");
                const filetags = (keywords["FILETAGS"] ?? "")
                    .split(/:+/)
                    .map((t: string) => t.trim())
                    .filter(Boolean);

                const orgItems = extractItems(ast, uri);

                if (isMounted) {
                    setHead({ title, filetags });
                    setItems(orgItems);
                }
            } catch (err) {
                console.error("Failed to parse note:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchNote();
        return () => { isMounted = false; };
    }, [uri]);

    if (loading) {
        return <ThemedLoader center size="large" />;
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <Stack.Screen options={{ title: head.title }} />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    {head.filetags.length > 0 && (
                        <View style={styles.tagRow}>
                            {head.filetags.map(tag => (
                                <View key={tag} style={[styles.tag, { backgroundColor: tagBg }]}>
                                    <ThemedText style={[styles.tagText, { color: tagText }]}>
                                        {tag}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {items.length > 0
                    ? <NoteTree items={items} />
                    : <ThemedText style={styles.empty}>No headings found.</ThemedText>
                }
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 64 },
    header: { marginBottom: 12 },
    title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
    tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    tagText: { fontSize: 12, fontWeight: "500" },
    divider: { height: 1, marginBottom: 4, opacity: 0.2 },
    empty: { fontStyle: "italic", opacity: 0.5, marginTop: 24, textAlign: "center" },
});
