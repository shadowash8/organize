import * as FileSystem from 'expo-file-system/legacy';
import listFilesInDir from '@/hooks/list-files-in-dir';
import { getData, storeData } from '@/hooks/storage';
import { parse } from 'uniorg-parse/lib/parser';
import { OrgItem } from '@/types/org';

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

                // look ahead for planning and description in siblings
                const next = nodes[i + 1];
                const after = nodes[i + 2];

                if (next?.type === 'planning') {
                    if (next.scheduled) item.scheduled = next.scheduled.start;
                    if (next.deadline) item.deadline = next.deadline.start;
                }

                // check for description list (not a state log)
                const listNode = next?.type === 'plain-list' ? next : after?.type === 'plain-list' ? after : null;
                if (listNode) {
                    const text = listNode.children
                        .flatMap((li: any) => li.children)
                        .flatMap((p: any) => p.children)
                        .filter((c: any) => c.type === 'text' && !c.value.startsWith('State "'))
                        .map((c: any) => c.value.trim())
                        .join(' ');
                    if (text) item.description = text;
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

    for (const uri of paths) {
        const content = await readOrgFile(uri);
        const ast = parse(content, {
            todoKeywords: ['TODO', 'WORKING', 'WAIT', 'IDEA', 'DONE', 'CANC']
        });
        const items = extractItems(ast, uri);
        allItems.push(...items);
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
