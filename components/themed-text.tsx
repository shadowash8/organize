import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle";
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
        <Text
            style={[
                { color },
                type === "default" ? styles.default : undefined,
                type === "title" ? styles.title : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        lineHeight: 24,
    },
    defaultSemiBold: {
        lineHeight: 24,
        fontWeight: "600",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
