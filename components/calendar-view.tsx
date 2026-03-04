import { useState } from "react";
import {
    Host,
    ModalBottomSheet,
    Column,
    TextButton,
} from "@expo/ui/jetpack-compose";
import { paddingAll, fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { ThemedButton } from "@/components/themed-button";

const CALENDAR_VIEWS = ["schedule", "week", "month"] as const;
type CalendarView = (typeof CALENDAR_VIEWS)[number];

export function CalendarViewPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: CalendarView) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Host matchContents>
            <ThemedButton
                title={value}
                onPress={() => setOpen(true)}
                variant="ghost"
            />
            {open && (
                <ModalBottomSheet onDismissRequest={() => setOpen(false)}>
                    <Column modifiers={[paddingAll(16)]}>
                        {CALENDAR_VIEWS.map((opt) => (
                            <TextButton
                                key={opt}
                                onPress={() => {
                                    onChange(opt);
                                    setOpen(false);
                                }}
                                modifiers={[fillMaxWidth(100)]}
                            >
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </TextButton>
                        ))}
                    </Column>
                </ModalBottomSheet>
            )}
        </Host>
    );
}
