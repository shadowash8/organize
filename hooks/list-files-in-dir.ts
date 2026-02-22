import { Directory, File } from 'expo-file-system';

function printDirectory(directory: Directory, allFiles: string[] = []) {
    const contents = directory.list();
    for (const item of contents) {
        if (item instanceof Directory) {
            printDirectory(item, allFiles);
        } else if (item instanceof File) {
            allFiles.push(item.name);
        }
    }
    return allFiles;
}

export default async function listFilesInDir() {
    try {
        const directory = await Directory.pickDirectoryAsync();

        if (directory) {
            const fileList = printDirectory(directory);

            console.log("Final File List:", fileList);
            return fileList; // This now returns to your index.tsx!
        }
    } catch (error) {
        console.error(error);
    }
}
