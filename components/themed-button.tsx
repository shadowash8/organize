import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type ThemedButtonProps = {
    title: string;
    onPress?: () => void;
    variant?: "primary" | "alert" | "ghost";
};

export function ThemedButton({ title, onPress, variant = "primary" }: ThemedButtonProps) {
    const bg = useThemeColor({}, variant === "primary" ? "tint" : "background");
    const text = useThemeColor({}, variant === "primary" ? "background" : "tint");
    const border = useThemeColor({}, "border");

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                { backgroundColor: bg },
                variant === "ghost" && { borderWidth: 1, borderColor: border },
                variant === "alert" && { backgroundColor: "#c53e3e" }
            ]}
        >
            <ThemedText style={{ color: text, fontWeight: "600" }}>{title}</ThemedText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});
