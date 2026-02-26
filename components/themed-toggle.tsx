import { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    type ViewProps,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

export type ThemedToggleProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    heading: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
};

export function ThemedToggle({
    style,
    lightColor,
    darkColor,
    heading,
    children,
    defaultOpen = true,
    ...otherProps
}: ThemedToggleProps) {
    const [open, setOpen] = useState(defaultOpen);
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const itemColor = useThemeColor({}, "surface");
    const borderColor = useThemeColor({}, "border");
    const iconColor = useThemeColor({}, "text");

    const name = heading.split("/").pop()?.replace(".org", "") ?? heading;
    const prettyHeading = name.charAt(0).toUpperCase() + name.slice(1);

    return (
        <View
            style={[styles.container, { backgroundColor }, style]}
            {...otherProps}
        >
            <TouchableOpacity
                onPress={() => setOpen((o) => !o)}
                style={[styles.heading, { borderColor, backgroundColor: itemColor }]}
            >
                <IconSymbol
                    name={open ? "chevron.down" : "chevron.right"}
                    size={18}
                    color={iconColor}
                />
                <ThemedText style={styles.headingText}>{prettyHeading}</ThemedText>
            </TouchableOpacity>

            {
                open && (
                    <View style={[styles.content, { borderColor }]}>{children}</View>
                )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
    },
    heading: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: 8,
    },
    arrow: {
        fontSize: 12,
    },
    headingText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderLeftWidth: 1,
        marginLeft: 2,
    },
});
