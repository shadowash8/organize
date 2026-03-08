import { TouchableOpacity, ToastAndroid } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { Calendar } from "react-native-big-calendar";
import { getOrgItems } from "@/hooks/org-docs";
import uniOrgToCalendar from "@/hooks/uniorg-to-calendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OrgItem } from "@/types/org";
import { Stack } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedLoader } from "@/components/themed-loader";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "@/hooks/storage";

function getScheduleEndDate(duration: "7days" | "month" | "year"): Date {
    const now = new Date();
    switch (duration) {
        case "7days":
            return new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 7,
            );
        case "month":
            return new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate(),
            );
        case "year":
            return new Date(
                now.getFullYear() + 1,
                now.getMonth(),
                now.getDate(),
            );
    }
}

export default function CalendarScreen() {
    const [items, setItems] = useState<OrgItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [mode, setMode] = useState<"schedule" | "week" | "month">("schedule");
    const [scheduleDuration, setScheduleDuration] = useState<
        "7days" | "month" | "year"
    >("7days");

    // colors
    const accent = useThemeColor({}, "accent");
    const bg = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");

    const calendarTheme = useMemo(
        () => ({
            palette: {
                primary: { main: accent, contrastText: bg },
                gray: {
                    "100": text,
                    "200": text,
                    "300": text,
                    "500": text,
                    "800": text,
                },
            },
        }),
        [accent, bg, text],
    );

    const getItems = useCallback(async (refresh = false) => {
        setRefreshing(true);
        setItems(await getOrgItems(refresh));
        setRefreshing(false);
        if (refresh) {
            ToastAndroid.show("Refreshed", ToastAndroid.SHORT);
        }
    }, []);

    useEffect(() => {
        getItems();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getData("calendar_view").then((v) => {
                if (v) setMode(v as any);
            });
            getData("schedule_duration").then((v) => {
                if (v) setScheduleDuration(v as ScheduleDuration);
            });
        }, []),
    );

    const allEvents = useMemo(() => uniOrgToCalendar(items), [items]);

    const events = useMemo(() => {
        if (mode !== "schedule") return allEvents;
        const now = new Date();
        const end = getScheduleEndDate(scheduleDuration);
        return allEvents.filter((e) => e.start >= now && e.start <= end);
    }, [allEvents, mode, scheduleDuration]);

    if (refreshing) {
        return <ThemedLoader center size="large" />;
    }

    return (
        <ThemedView
            style={{ height: "100%" }}
            onLayout={(e) => setCalendarHeight(e.nativeEvent.layout.height)}
        >
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => getItems(true)}
                            disabled={refreshing}
                            style={{ marginRight: 12 }}
                        >
                            <IconSymbol
                                name="arrow.clockwise"
                                size={20}
                                color={accent}
                            />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Calendar
                events={events}
                height={calendarHeight}
                mode={mode}
                theme={calendarTheme}
            />
        </ThemedView>
    );
}
