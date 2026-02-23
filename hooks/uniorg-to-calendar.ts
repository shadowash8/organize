import { OrgItem } from "@/types/org";

export interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
}

export default function uniOrgToCalendar(orgArray: OrgItem[]): CalendarEvent[] {
    return orgArray
        .filter(item => (item.scheduled || item.deadline) && item.todoKeyword !== "DONE" && item.todoKeyword !== "CANC")
        .map(item => {
            const ts = item.scheduled ?? item.deadline!;
            const start = new Date(ts.year, ts.month - 1, ts.day, ts.hour ?? 0, ts.minute ?? 0);
            const end = new Date(ts.year, ts.month - 1, ts.day, (ts.hour ?? 0) + 1, ts.minute ?? 0);
            return {
                title: item.todoKeyword ? `[${item.todoKeyword}] ${item.title}` : item.title,
                start,
                end,
            };
        });
}
