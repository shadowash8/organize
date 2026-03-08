import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";
import { ThemedButton } from "@/components/themed-button";
import { useEffect, useState } from "react";
import { getData, storeData } from "@/hooks/storage";
import { ThemedSectionRow } from "@/components/themed-section-row";
import { Directory } from "expo-file-system";
import { clearOrgCache, getOrgItems } from "@/hooks/org-docs";
import { CalendarViewPicker } from "@/components/ui/calendar-view";
import { ScheduleDurationPicker } from "@/components/ui/schedule-picker";
import { Host, Switch } from "@expo/ui/jetpack-compose";

function NativeSwitch({
    value,
    onValueChange,
}: {
    value: boolean;
    onValueChange: (v: boolean) => void;
}) {
    return (
        <Host matchContents>
            <Switch value={value} onValueChange={onValueChange} />
        </Host>
    );
}

export default function SettingsScreen() {
    const [folderUri, setFolderUri] = useState<string | null>(null);
    const [calendarView, setCalendarView] = useState<
        "schedule" | "week" | "month"
    >("schedule");
    const [showDone, setShowDone] = useState(true);
    const [showNoKeyword, setShowNoKeyword] = useState(true);
    const [defaultOpen, setDefaultOpen] = useState(false);
    const [scheduleDuration, setScheduleDuration] = useState<"7days" | "month" | "year">("7days");

    useEffect(() => {
        getData("org_folder_uri").then(setFolderUri);
        getData("calendar_view").then((v) => {
            if (v) setCalendarView(v as any);
        });
        getData("show_done").then((v) => {
            if (v !== null) setShowDone(v === "true");
        });
        getData("show_no_keyword").then((v) => {
            if (v !== null) setShowNoKeyword(v === "true");
        });
        getData("default_open").then((v) => {
            if (v !== null) setDefaultOpen(v === "true");
        });
        getData("schedule_duration").then((v) => {
            if (v) setScheduleDuration(v as ScheduleDuration);
        });
    }, []);

    const changeFolder = async () => {
        try {
            const directory = await Directory.pickDirectoryAsync();
            if (directory) {
                await storeData("org_folder_uri", directory.uri);
                setFolderUri(directory.uri);
                await clearOrgCache();
                await getOrgItems(true);
            }
        } catch (e) {}
    };

    const name = folderUri
        ? (decodeURIComponent(folderUri)
              .split(":")
              .pop()
              ?.replace(/\//g, "/") ?? folderUri)
        : "None selected";

    return (
        <ThemedView style={{ paddingHorizontal: 16, height: "100%" }}>
            <ScrollView>
                <ThemedSectionRow
                    title="Show DONE items"
                    description="Show completed items in tree view"
                    action={
                        <NativeSwitch
                            value={showDone}
                            onValueChange={async (v) => {
                                setShowDone(v);
                                await storeData("show_done", String(v));
                            }}
                        />
                    }
                />
                <ThemedSectionRow
                    title="Show untagged items"
                    description="Show items with no todo keyword"
                    action={
                        <NativeSwitch
                            value={showNoKeyword}
                            onValueChange={async (v) => {
                                setShowNoKeyword(v);
                                await storeData("show_no_keyword", String(v));
                            }}
                        />
                    }
                />
                <ThemedSectionRow
                    title="Default expand"
                    description="Expand all files on home screen by default"
                    action={
                        <NativeSwitch
                            value={defaultOpen}
                            onValueChange={async (v) => {
                                setDefaultOpen(v);
                                await storeData("default_open", String(v));
                            }}
                        />
                    }
                />
                <ThemedSectionRow
                    title="Calendar View"
                    description={`Current: ${calendarView}`}
                    action={
                        <CalendarViewPicker
                            value={calendarView}
                            onChange={async (v) => {
                                setCalendarView(v);
                                await storeData("calendar_view", v);
                            }}
                        />
                    }
                />
                {calendarView === "schedule" && (
                    <ThemedSectionRow
                        title="Schedule list duration"
                        description={`Current: ${scheduleDuration}`}
                        action={
                            <ScheduleDurationPicker
                                value={scheduleDuration}
                                onChange={async (v) => {
                                    setScheduleDuration(v);
                                    await storeData("schedule_duration", v);
                                }}
                            />
                        }
                    />
                )}
                <ThemedSectionRow
                    title="Org Folder"
                    description={name}
                    action={
                        <ThemedButton title="Change" onPress={changeFolder} />
                    }
                />
                <ThemedSectionRow
                    title="Clear Cache Data"
                    description="Clear the saved data from cache"
                    action={
                        <ThemedButton
                            title="Clear"
                            variant="alert"
                            onPress={() => clearOrgCache()}
                        />
                    }
                />
            </ScrollView>
        </ThemedView>
    );
}
