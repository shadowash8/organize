import { OrgItem } from '@/types/org';
import { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

function OrgTreeItem({ item, children }: { item: OrgItem; children?: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'background');
    const iconColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
    const todoColor = item.todoKeyword === 'DONE' ? '#888' : '#f59e0b';

    return (
        <View style={{ marginLeft: (item.level - 1) * 8 }}>
            <TouchableOpacity
                onPress={() => setOpen(o => !o)}
                style={styles.row}
                disabled={!children}
            >

                <View style={{ flexDirection: 'column' }}>
                    <View style={styles.row}
                    >
                        {children
                            ? <IconSymbol name={open ? 'chevron.down' : 'chevron.right'} size={18} color={iconColor} />
                            : <IconSymbol name='circle.fill' size={6} color={iconColor} style={{ marginHorizontal: 6 }} />
                        }
                        <ThemedText style={[styles.title, item.todoKeyword === 'DONE' && styles.done]}>
                            {item.todoKeyword && (
                                <ThemedText style={[styles.keyword, { color: todoColor }]}>
                                    {item.todoKeyword}
                                </ThemedText>
                            )}
                            {'  '}
                            {item.title}
                        </ThemedText>
                    </View>
                    {item.deadline && (
                        <ThemedText style={{ paddingLeft: 30, fontSize: 12, opacity: 0.6 }}>
                            deadline: {item.deadline.year}-{item.deadline.month}-{item.deadline.day}
                        </ThemedText>
                    )}
                    {item.scheduled && (
                        <ThemedText style={{ paddingLeft: 30, fontSize: 12, opacity: 0.6 }}>
                            scheduled: {item.scheduled.year}-{item.scheduled.month}-{item.scheduled.day}
                        </ThemedText>
                    )}
                </View>

            </TouchableOpacity>

            {open && children && (
                <View style={[styles.children, { borderLeftColor: borderColor }]}>
                    {children}
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 5,
    },
    arrow: {
        fontSize: 12,
        width: 12,
    },
    keyword: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 14,
    },
    done: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    children: {
        borderLeftWidth: 1,
        marginLeft: 6,
        paddingLeft: 8,
    },
});

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
