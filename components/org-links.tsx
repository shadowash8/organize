// hooks/org-utils.tsx
import { Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';

export function renderLinks(title: string) {
    const linkRegex = /\[\[([^\]]+)\]\[([^\]]+)\]\]/g;
    const parts: React.ReactNode[] = [];
    const accent = useThemeColor({}, "accent");
    let last = 0;
    let match;

    while ((match = linkRegex.exec(title)) !== null) {
        if (match.index > last) parts.push(title.slice(last, match.index));
        const [, url, label] = match;
        parts.push(
            <ThemedText
                key={match.index}
                style={{ color: accent, textDecorationLine: 'underline' }}
                onPress={() => Linking.openURL(url)}
            >
                {label}
            </ThemedText>
        );
        last = match.index + match[0].length;
    }

    if (last < title.length) parts.push(title.slice(last));
    return parts;
}

export function RenderLinks({ title, style }: { title: string; style?: any }) {
    return (
        <ThemedText style={style}>
            {renderLinks(title)}
        </ThemedText>
    );
}
