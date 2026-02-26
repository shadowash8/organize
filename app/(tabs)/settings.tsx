import { ThemedView } from "@/components/themed-view";
import { ScrollView } from "react-native";
import { ThemedButton } from "@/components/themed-button";
import { useEffect, useState } from "react";
import { getData, storeData } from "@/hooks/storage";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedSectionRow } from "@/components/themed-setion-row";
import { Directory } from "expo-file-system";
import { clearOrgCache, getOrgItems } from "@/hooks/org-docs";

export default function SettingsScreen() {
    const [folderUri, setFolderUri] = useState<string | null>(null);
    const border = useThemeColor({}, "border");


    useEffect(() => {
        getData("org_folder_uri").then(setFolderUri);
    }, []);

    const changeFolder = async () => {
        const directory = await Directory.pickDirectoryAsync();

        if (directory) {
            await storeData("org_folder_uri", directory.uri);
            setFolderUri(directory.uri);
            await clearOrgCache();
            await getOrgItems(true);
        }
    }

    const name = folderUri
        ? decodeURIComponent(folderUri)
            .split(':').pop()
            ?.replace(/\//g, '/') ?? folderUri
        : "None selected";

    return (
        <ThemedView style={{ padding: 8, height: "100%" }}>
            <ScrollView>
                <ThemedSectionRow
                    title="Org Folder"
                    description={name}
                    action={<ThemedButton title="Change" onPress={changeFolder} />}
                />
            </ScrollView>
        </ThemedView >
    );
}

