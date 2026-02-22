import * as FileSystem from 'expo-file-system/legacy';
import listFilesInDir from '@/hooks/list-files-in-dir';
import { getData, storeData } from '@/hooks/storage';

export async function readOrgFile(uri: string): Promise<string> {
    return await FileSystem.readAsStringAsync(uri);
}

export async function getOrgDocs(refresh = false) {
    if (!refresh) {
        const cached = await getData('org_docs');
        if (cached) return JSON.parse(cached) as string[];
    }
    const path = await getData('org_folder_uri');
    if (!path) return [];
    const result = await listFilesInDir(path);
    const orgFiles = (result ?? [])
        .filter(uri => uri.endsWith('.org'))
        .map(uri => decodeURIComponent(uri).split('/').pop() ?? uri);
    await storeData('org_docs', JSON.stringify(orgFiles));
    return orgFiles;
}

export async function getOrgDocsPaths(refresh = false) {
    if (!refresh) {
        const cached = await getData('org_docs_path');
        if (cached) return JSON.parse(cached) as string[];
    }
    const folderUri = await getData('org_folder_uri');
    if (!folderUri) return [];
    const result = await listFilesInDir(folderUri);
    const orgFiles = (result ?? []).filter(uri => uri.endsWith('.org'));
    await storeData('org_docs_path', JSON.stringify(orgFiles));
    return orgFiles;
}
