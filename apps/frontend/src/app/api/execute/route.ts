import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, language, stdin } = body;

        if (!code || !language) {
            return NextResponse.json({ error: "Missing code or language" }, { status: 400 });
        }

        const response = await fetch(`${API_URL}/api/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, language, stdin }),
            signal: AbortSignal.timeout(15000), // 15s total budget
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: "Execution service error" }));
            return NextResponse.json(
                { error: err.message ?? "Execution failed" },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (err: any) {
        if (err.name === "TimeoutError") {
            return NextResponse.json({ error: "Execution timed out (>15s)" }, { status: 504 });
        }
        return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 });
    }
}
