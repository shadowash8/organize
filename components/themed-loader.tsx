import {
    ActivityIndicator,
    StyleSheet,
    View,
    type ViewProps,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "./themed-view";

export type ThemedLoaderProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    size?: "small" | "large";
    center?: boolean;
};

export function ThemedLoader({
    style,
    lightColor,
    darkColor,
    size = "small",
    center = false,
    ...rest
}: ThemedLoaderProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "accent");

    return (
        <ThemedView style={[center && styles.center, style]} {...rest}>
            <ActivityIndicator size={size} color={color} />
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
