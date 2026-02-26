import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type ThemedSectionRowProps = {
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export function ThemedSectionRow({ title, description, action }: ThemedSectionRowProps) {
    const border = useThemeColor({}, "border");

    return (
        <View style={[styles.row, { borderColor: border }]}>
            <View style={styles.info}>
                <ThemedText type="defaultSemiBold">{title}</ThemedText>
                {description && (
                    <ThemedText style={styles.description}>{description}</ThemedText>
                )}
            </View>
            {action}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    description: {
        opacity: 0.6,
        fontSize: 12,
    },
});
