import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import filePicker from '@/hooks/file-picker';
import { getOrgDocsPaths, readOrgFile } from '@/hooks/org-docs';
import { useEffect, useState } from 'react';
import { Button, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const [files, setFiles] = useState<{ uri: string; content: string }[]>([]);

    useEffect(() => {
        const loadFolder = async () => {
            const paths = await getOrgDocsPaths();

            const contents = await Promise.all(
                paths.map(async (uri) => ({
                    uri,
                    content: await readOrgFile(uri),
                }))
            );
            setFiles(contents);
        };
        loadFolder();
    }, []);

    return (
        <SafeAreaView>
            <ThemedView>
                <ThemedText>HII im here</ThemedText>
                <Button onPress={() => filePicker()} title="Select File" />
                <FlatList
                    data={files}
                    renderItem={({ item }) => (
                        <ThemedText>{item.content}</ThemedText>
                    )}
                />
            </ThemedView>
        </SafeAreaView>
    );
}
