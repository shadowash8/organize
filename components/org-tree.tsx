import { OrgItem } from '@/types/org';
import { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RenderLinks } from '@/components/org-links';

function OrgTreeItem({ item, children }: { item: OrgItem; children?: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'background');
    const iconColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
    const todoColor = item.todoKeyword === 'DONE' || item.todoKeyword === 'CANC' ? '#888' : '#f59e0b';

    return (
        <View style={{ marginLeft: (item.level - 1) * 8 }}>
            <TouchableOpacity
                onPress={() => setOpen(o => !o)}
                style={styles.touchableRow}
                disabled={!children}
            >
                {children ? (
                    <IconSymbol name={open ? 'chevron.down' : 'chevron.right'} size={18} color={iconColor} />
                ) : (
                    <View style={styles.bulletContainer}>
                        <IconSymbol name='circle.fill' size={6} color={iconColor} />
                    </View>
                )}

                <View style={styles.contentColumn}>
                    <View style={styles.textRow}>
                        {item.todoKeyword && (
                            <ThemedText style={[styles.keyword, { color: todoColor }]}>
                                {item.todoKeyword}
                            </ThemedText>
                        )}
                        <RenderLinks
                            title={item.title}
                            style={[styles.title, (item.todoKeyword === 'DONE' || item.todoKeyword === 'CANC') && styles.done]}
                        />
                    </View>

                    {item.deadline && (
                        <ThemedText style={styles.metaText}>
                            deadline: {item.deadline.year}-{item.deadline.month}-{item.deadline.day}
                        </ThemedText>
                    )}
                    {item.scheduled && (
                        <ThemedText style={styles.metaText}>
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
    touchableRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        paddingVertical: 5,
    },
    bulletContainer: {
        height: 20,
        width: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    textRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
    },
    keyword: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 14,
        flexShrink: 1,
    },
    metaText: {
        paddingLeft: 6,
        fontSize: 12,
        opacity: 0.6,
    },
    done: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    children: {
        borderLeftWidth: 1,
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
    return <View style={{ width: '100%' }}>{tree}</View>;
}
