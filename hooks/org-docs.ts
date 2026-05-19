import * as FileSystem from 'expo-file-system/legacy';
import listFilesInDir from '@/hooks/list-files-in-dir';
import { getData, storeData } from '@/hooks/storage';
import parse from 'uniorg-parse';
import { OrgItem } from '@/types/org';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NoteFile } from '@/types/note';
import { unified } from 'unified';
import uniorg2rehype from 'uniorg-rehype';
import stringify from 'rehype-stringify';

// ORG-Mode
export function extractItems(ast: any, sourceUri: string): OrgItem[] {
    const items: OrgItem[] = [];

    function walk(nodes: any[]) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node.type === 'headline') {
                const item: OrgItem = {
                    title: node.rawValue,
                    level: node.level,
                    todoKeyword: node.todoKeyword,
                    sourceUri,
                };

                const next = nodes[i + 1];
                const after = nodes[i + 2];

                if (next?.type === 'planning') {
                    if (next.scheduled) item.scheduled = next.scheduled.start;
                    if (next.deadline) item.deadline = next.deadline.start;
                }

                const bodyNode = next?.type === 'paragraph' || next?.type === 'plain-list'
                    ? next
                    : after?.type === 'paragraph' || after?.type === 'plain-list'
                        ? after
                        : null;

                if (bodyNode) {
                    if (bodyNode.type === 'paragraph') {
                        const text = (bodyNode.children || [])
                            .filter((c: any) => c.type === 'text')
                            .map((c: any) => c.value.trim())
                            .join(' ');
                        if (text) item.description = text;
                    }

                    else if (bodyNode.type === 'plain-list') {
                        // process each list item individually so we can preserve line breaks
                        const lines = (bodyNode.children || [])
                            .map((li: any) => {
                                return (li.children || [])
                                    .flatMap((p: any) => p.children || [])
                                    .filter((c: any) => c.type === 'text' && !c.value.startsWith('State "'))
                                    .map((c: any) => c.value.trim())
                                    .join(' ');
                            })
                            .filter((line: string) => line.length > 0);

                        // join items with a newline character (\n) instead of a space (' ')
                        if (lines.length > 0) {
                            item.description = lines.join('\n');
                        }
                    }
                }

                items.push(item);
            }

            if (node.children) walk(node.children);
        }
    }

    walk(ast.children);
    return items;
}

export async function getOrgItems(refresh = false): Promise<OrgItem[]> {
    if (!refresh) {
        const cached = await getData('org_items');
        if (cached) return JSON.parse(cached) as OrgItem[];
    }

    const paths = await getOrgDocsPaths();
    const allItems: OrgItem[] = [];

    const processor = unified().use(parse, {
        todoKeywords: ['TODO', 'WORKING', 'WAIT', 'IDEA', 'DONE', 'CANC']
    });

    for (const uri of paths) {
        try {
            const content = await readOrgFile(uri);

            const ast = processor.parse(content) as any;

            const items = extractItems(ast, uri);
            allItems.push(...items);
        } catch (fileError) {
            console.error(`Skipping file due to an error reading ${uri}:`, fileError);
        }
    }

    await storeData('org_items', JSON.stringify(allItems));
    return allItems;
}

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

export async function clearOrgCache() {
    await AsyncStorage.multiRemove(["org_docs", "org_docs_path", "org_items"]);
}

// --- ORG-ROAM ---
export async function getNote(uri: string): Promise<NoteFile | null> {
    try {
        const fileContents = await readOrgFile(uri);

        // Let unified map the Org AST into an HTML AST (hast) and stringify it
        const fileResult = await unified()
            .use(parse, {
                todoKeywords: ['TODO', 'WORKING', 'WAIT', 'DONE']
            })
            .use(uniorg2rehype)
            .use(stringify)
            .process(fileContents);

        const htmlString = String(fileResult);
        const filename = decodeURIComponent(uri).split('/').pop() ?? uri;

        return {
            uri,
            filename,
            title: filename.replace('.org', ''),
            preview: fileContents.slice(0, 100).replace(/[*~]/g, '') + '...',
            content: htmlString,
            wordCount: fileContents.split(/\s+/).filter(Boolean).length
        };

    } catch (e) {
        console.error("Error generating clean HTML note with unified:", e);
        return null;
    }
}

export async function getNotes(refresh = false): Promise<NoteFile[]> {
    if (!refresh) {
        const cached = await getData('notes_files');
        if (cached) return JSON.parse(cached) as NoteFile[];
    }

    const folderUri = await getData('notes_folder_uri');
    if (!folderUri) return [];

    const result = await listFilesInDir(folderUri);
    const paths = (result ?? []).filter(uri => uri.endsWith('.org'));
    if (paths.length === 0) return [];

    const notesResults = await Promise.all(paths.map(p => getNote(p)));
    // Filter away files that failed silently to load cleanly
    const notes = notesResults.filter((note): note is NoteFile => note !== null);

    await storeData('notes_files', JSON.stringify(notes));
    return notes;
}

export async function clearNotesCache() {
    await AsyncStorage.removeItem('notes_files');
}
