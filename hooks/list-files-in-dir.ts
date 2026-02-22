import * as FileSystem from 'expo-file-system/legacy';

export default async function listFilesInDir(safUri: string) {
    try {
        const contents = await FileSystem.StorageAccessFramework.readDirectoryAsync(safUri);

        return contents;
    } catch (error) {
        console.error(error);
    }
}

/* NOTE if only want the file names then
 * const names = contents.map(uri => decodeURIComponent(uri).split('/').pop() ?? '');
*/
