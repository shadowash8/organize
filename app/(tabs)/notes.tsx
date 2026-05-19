import { useEffect, useState, useCallback } from "react";
import { FlatList, TouchableOpacity, View, StyleSheet, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getNotes, clearNotesCache } from "@/hooks/org-docs";
import { NoteFile } from "@/types/note";
import { ThemedLoader } from "@/components/themed-loader";

function NoteCard({ note, onPress }: { note: NoteFile; onPress: () => void }) {
    const borderColor = useThemeColor({}, 'border');
    const backgroundColor = useThemeColor({}, 'surface');
    const iconColor = useThemeColor({}, 'icon');
    const mutedColor = useThemeColor({}, 'accent');

    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, { borderColor, backgroundColor }]} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle} numberOfLines={1}>{note.title}</ThemedText>
                <IconSymbol name="chevron.right" size={16} color={iconColor} />
            </View>
            {note.preview ? (
                <ThemedText style={[styles.cardPreview, { color: mutedColor }]} numberOfLines={2}>
                    {note.preview}
                </ThemedText>
            ) : (
                <ThemedText style={[styles.cardPreview, { color: mutedColor, fontStyle: 'italic' }]}>
                    Empty note
                </ThemedText>
            )}
            <View style={styles.cardMeta}>
                <ThemedText style={[styles.metaText, { color: mutedColor }]}>{note.wordCount ?? 0} words</ThemedText>
            </View>
        </TouchableOpacity>
    );
}

export default function NotesScreen() {
    const [notes, setNotes] = useState<NoteFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();
    const mutedColor = useThemeColor({}, 'accent');

    const load = useCallback(async (refresh = false) => {
        try {
            setErrorMessage(null); // Clear errors on retry
            if (refresh) await clearNotesCache();
            const data = await getNotes(refresh);
            setNotes(data);
        } catch (error) {
            console.error("Critical error while fetching or parsing notes:", error);
            setErrorMessage("Failed to read files. Try dragging to refresh or check permissions.");
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        async function initializeScreen() {
            setLoading(true);
            await load(false);
            if (isMounted) {
                setLoading(false);
            }
        }

        initializeScreen();
        return () => { isMounted = false; };
    }, [load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await load(true);
        setRefreshing(false);
    }, [load]);

    if (loading) {
        return <ThemedLoader center size="large" />;
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <FlatList
                data={notes}
                keyExtractor={item => item.uri}
                renderItem={({ item }) => (
                    <NoteCard
                        note={item}
                        onPress={() => router.push({
                            pathname: '/note-detail',
                            params: { uri: encodeURIComponent(item.uri) }
                        })}
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View>
                        {errorMessage && (
                            <ThemedText>{errorMessage}</ThemedText>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    !errorMessage ? (
                        <ThemedText style={[styles.empty, { color: mutedColor }]}>
                            No .org files found in your notes folder.
                        </ThemedText>
                    ) : null
                }
            />
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { paddingVertical: 8, paddingHorizontal: 12, paddingBottom: 40 },
    screenTitle: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
    empty: { fontSize: 14, fontStyle: 'italic' },
    card: {
        borderWidth: 2,
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
        gap: 6,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
    cardPreview: { fontSize: 13, lineHeight: 18 },
    cardMeta: { flexDirection: 'row', gap: 6, marginTop: 2 },
    metaText: { fontSize: 11 },
});
