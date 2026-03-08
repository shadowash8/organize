import { useState } from "react";
import {
    Host,
    ModalBottomSheet,
    Column,
    TextButton,
} from "@expo/ui/jetpack-compose";
import { paddingAll, fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { ThemedButton } from "@/components/themed-button";
import { ScheduleDurationType } from "@types/data";

const SCHEDULE_DURATIONS = ["7days", "month", "year"] as const;

const DURATION_LABELS: Record<ScheduleDurationType, string> = {
    "7days": "7 Days",
    month: "Month",
    year: "Year",
};

export function ScheduleDurationPicker({
    value,
    onChange,
}: {
    value: ScheduleDuration;
    onChange: (v: ScheduleDuration) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Host matchContents>
            <ThemedButton title="Change" onPress={() => setOpen(true)} />
            {open && (
                <ModalBottomSheet onDismissRequest={() => setOpen(false)}>
                    <Column modifiers={[paddingAll(16)]}>
                        {SCHEDULE_DURATIONS.map((opt) => (
                            <TextButton
                                key={opt}
                                onPress={() => {
                                    onChange(opt);
                                    setOpen(false);
                                }}
                                modifiers={[fillMaxWidth(100)]}
                            >
                                {DURATION_LABELS[opt]}
                            </TextButton>
                        ))}
                    </Column>
                </ModalBottomSheet>
            )}
        </Host>
    );
}
