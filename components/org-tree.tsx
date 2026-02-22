import { OrgItem } from '@/types/org';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

function OrgTreeItem({ item, children }: { item: OrgItem; children?: React.ReactNode }) {
    const [open, setOpen] = useState(true);

    return (
        <View style={{ marginLeft: (item.level - 1) * 16 }}>
            <TouchableOpacity onPress={() => setOpen(o => !o)} style={{ flexDirection: 'row', gap: 4 }}>
                <ThemedText>{children ? (open ? '▾' : '▸') : '•'}</ThemedText>
                <ThemedText>{item.title}</ThemedText>
                {item.todoKeyword && <ThemedText>[{item.todoKeyword}]</ThemedText>}
            </TouchableOpacity>
            {open && children}
        </View>
    );
}

export function OrgTree({ items }: { items: OrgItem[] }) {
    function buildTree(items: OrgItem[], level: number, index: number): [React.ReactNode[], number] {
        const nodes: React.ReactNode[] = [];

        while (index < items.length) {
            const item = items[index];
            if (item.level < level) break;

            if (item.level === level) {
                index++;
                const [children, newIndex] = buildTree(items, level + 1, index);
                index = newIndex;
                nodes.push(
                    <OrgTreeItem key={index} item={item}>
                        {children.length > 0 ? children : undefined}
                    </OrgTreeItem>
                );
            } else {
                break;
            }
        }

        return [nodes, index];
    }

    const [tree] = buildTree(items, 1, 0);
    return <View>{tree}</View>;
}
