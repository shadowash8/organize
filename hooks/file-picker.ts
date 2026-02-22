import { File } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export default async function filePicker() {
    try {
        const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
        const file = new File(result.assets[0]);
        console.log(file.uri);
    } catch (error) {
        console.error(error);
    }
}
