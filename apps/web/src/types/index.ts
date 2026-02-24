// ============================
// Types for CodeMastery App
// ============================

// --- Chat & AI ---
export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

// --- Course & Lessons ---
export interface Lesson {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    type: "video" | "interactive" | "quiz";
    slug: string;
}

export interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface Course {
    title: string;
    slug: string;
    category: string;
    level: string;
    duration: string;
    lessons: number;
    image: string;
    progress?: number;
}

// --- Code Editor ---
export interface CodeEditorProps {
    initialCode?: string;
    language?: string;
    onRun?: (code: string) => void;
}

// --- Theme ---
export type Theme = "dark" | "light";
