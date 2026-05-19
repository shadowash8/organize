export interface NoteFile {
    uri: string;
    filename: string;
    title: string;
    preview: string;
    wordCount: number;
    content: string;
    sections?: Array<{
        heading: string;
        level: number;
        body: string[];
    }>;
}
