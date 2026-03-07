/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />

// ============================================================
// SQL Worker - Runs SQLite queries via sql.js (WebAssembly)
// Creates in-memory DB with sample tables for learning
// ============================================================

export interface WorkerInput {
    code: string;
}

export interface WorkerOutput {
    success: boolean;
    output: string;
    error?: string;
    executionTime: number;
}

const SQL_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";

let sqlInstance: any = null;
let sqlLoading: Promise<any> | null = null;

/**
 * Load sql.js and create an in-memory database with sample tables.
 * Cached for subsequent queries.
 */
async function getSqlDb(): Promise<any> {
    if (sqlInstance) return sqlInstance;

    if (!sqlLoading) {
        sqlLoading = (async () => {
            importScripts(SQL_JS_CDN);
            const SQL = await (self as any).initSqlJs({
                locateFile: (file: string) =>
                    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
            });

            const db = new SQL.Database();

            // Create sample tables for learning SQL
            db.run(`
                CREATE TABLE students (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT,
                    age INTEGER,
                    grade REAL
                );
                INSERT INTO students VALUES (1, 'Nguyen Van A', 'a@email.com', 20, 8.5);
                INSERT INTO students VALUES (2, 'Tran Thi B', 'b@email.com', 21, 9.0);
                INSERT INTO students VALUES (3, 'Le Van C', 'c@email.com', 19, 7.5);
                INSERT INTO students VALUES (4, 'Pham Thi D', 'd@email.com', 22, 8.8);
                INSERT INTO students VALUES (5, 'Hoang Van E', 'e@email.com', 20, 6.5);

                CREATE TABLE courses (
                    id INTEGER PRIMARY KEY,
                    title TEXT NOT NULL,
                    credits INTEGER
                );
                INSERT INTO courses VALUES (1, 'Lap trinh Python', 3);
                INSERT INTO courses VALUES (2, 'Co so du lieu', 4);
                INSERT INTO courses VALUES (3, 'Toan roi rac', 3);

                CREATE TABLE enrollments (
                    student_id INTEGER,
                    course_id INTEGER,
                    semester TEXT,
                    FOREIGN KEY(student_id) REFERENCES students(id),
                    FOREIGN KEY(course_id) REFERENCES courses(id)
                );
                INSERT INTO enrollments VALUES (1, 1, '2024A');
                INSERT INTO enrollments VALUES (1, 2, '2024A');
                INSERT INTO enrollments VALUES (2, 1, '2024A');
                INSERT INTO enrollments VALUES (3, 3, '2024B');
                INSERT INTO enrollments VALUES (4, 2, '2024A');
            `);

            sqlInstance = db;
            return db;
        })();
    }

    return sqlLoading;
}

/** Format query results as a readable ASCII table */
function formatTable(columns: string[], values: any[][]): string {
    if (!columns.length) return "(No columns)";
    if (!values.length) return columns.join(" | ") + "\n(0 rows)";

    // Calculate column widths
    const widths = columns.map((col, i) => {
        const maxVal = Math.max(...values.map((row) => String(row[i] ?? "NULL").length));
        return Math.max(col.length, maxVal);
    });

    const separator = widths.map((w) => "-".repeat(w)).join("-+-");
    const header = columns.map((col, i) => col.padEnd(widths[i])).join(" | ");
    const rows = values.map((row) =>
        row.map((val, i) => String(val ?? "NULL").padEnd(widths[i])).join(" | ")
    );

    return [header, separator, ...rows, `\n(${values.length} rows)`].join("\n");
}

self.onmessage = async function (event: MessageEvent<WorkerInput>) {
    const { code } = event.data;
    const startTime = performance.now();

    try {
        const db = await getSqlDb();
        const results: string[] = [];

        // Simple split of multiple queries by semicolon
        // Not perfect for comments, but good enough for generic SQL code execution tasks
        const statements = code
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);

        for (const stmt of statements) {
            const res = db.exec(stmt);
            if (res.length > 0) {
                for (const r of res) {
                    results.push(formatTable(r.columns, r.values));
                }
            } else {
                // If it's an INSERT/UPDATE/DELETE without returning anything
                const changes = db.getRowsModified();
                if (changes > 0) {
                    results.push(`Query OK, ${changes} row(s) affected`);
                }
            }
        }

        const response: WorkerOutput = {
            success: true,
            output: results.length > 0 ? results.join("\n\n") : "Query executed successfully (no results)",
            executionTime: Math.round(performance.now() - startTime),
        };

        self.postMessage(response);
    } catch (err: any) {
        const response: WorkerOutput = {
            success: false,
            output: "",
            error: err.message || String(err),
            executionTime: Math.round(performance.now() - startTime),
        };

        self.postMessage(response);
    }
};
