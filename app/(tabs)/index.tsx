import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import filePicker from '@/hooks/file-picker';
import listFilesInDir from '@/hooks/list-files-in-dir';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
        <SafeAreaView>
            <ThemedView>
                <ThemedText>HII im here</ThemedText>
                <Button onPress={() => filePicker()} title="Select File" />
                <Button onPress={() => listFilesInDir()} title="List files in dir" />
            </ThemedView>
        </SafeAreaView>
    );
}


