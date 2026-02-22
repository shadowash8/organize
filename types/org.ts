// types/org.ts
export type TodoKeyword = 'TODO' | 'DONE' | 'WORKING' | 'WAIT' | 'CANC' | 'IDEA' | string;


export type OrgTimestamp = {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
}

export type OrgItem = {
    title: string;
    level: number;
    todoKeyword: TodoKeyword | null;
    scheduled?: OrgTimestamp;
    deadline?: OrgTimestamp;
    description?: string;
    sourceUri: string;
}
