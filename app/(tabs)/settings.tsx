import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";
import { ThemedButton } from "@/components/themed-button";
import { useEffect, useState } from "react";
import { getData, storeData } from "@/hooks/storage";
import { ThemedSectionRow } from "@/components/themed-section-row";
import { Directory } from "expo-file-system";
import { clearOrgCache, getOrgItems } from "@/hooks/org-docs";
import { CalendarViewPicker } from "@/components/calendar-view";

export default function SettingsScreen() {
  const [folderUri, setFolderUri] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<
    "schedule" | "week" | "month"
  >("schedule");

  useEffect(() => {
    getData("org_folder_uri").then(setFolderUri);
    getData("calendar_view").then((v) => {
      if (v) setCalendarView(v as any);
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
    } catch (e) {
      // user cancelled, do nothing
    }
  };

  const name = folderUri
    ? (decodeURIComponent(folderUri).split(":").pop()?.replace(/\//g, "/") ??
      folderUri)
    : "None selected";

  return (
    <ThemedView style={{ paddingHorizontal: 16, height: "100%" }}>
      <ScrollView>
        <ThemedSectionRow
          title="Calendar View"
          description={`Current: ${calendarView}`}
          action={
            <CalendarViewPicker
              value="Change"
              onChange={async (v) => {
                setCalendarView(v);
                await storeData("calendar_view", v);
              }}
            />
          }
        />
        <ThemedSectionRow
          title="Org Folder"
          description={name}
          action={<ThemedButton title="Change" onPress={changeFolder} />}
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
