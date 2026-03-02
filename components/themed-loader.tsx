import {
    StyleSheet,
    type ViewProps,
} from "react-native";
import { ThemedView } from "./themed-view";
import { Host, CircularProgress } from '@expo/ui/jetpack-compose';

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
    center = false,
    ...rest
}: ThemedLoaderProps) {

    return (
        <ThemedView style={[center && styles.center, style]} {...rest}>
            <Host matchContents>
                <CircularProgress />
            </Host>
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
