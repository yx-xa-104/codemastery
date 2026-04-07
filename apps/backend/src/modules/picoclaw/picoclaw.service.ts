import { Injectable, Logger } from "@nestjs/common";
import { SupabaseService } from "../../infrastructure/database/supabase.service";

interface PicoclawResponse {
  status: string;
  reply: string;
}

@Injectable()
export class PicoclawService {
  private readonly logger = new Logger(PicoclawService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async generateTitle(prompt: string): Promise<string> {
    try {
      const summaryPrompt = `Tóm tắt nội dung sau thành 1 tiêu đề thật ngắn gọn (dưới 8 chữ, không dùng dấu ngoặc kép): ${prompt}`;
      const apiUrl = process.env.CODING_API_URL || process.env.PICOCLAW_API_URL;
      const apiKey = process.env.CODING_API_KEY || process.env.PICOCLAW_API_KEY;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          message: summaryPrompt,
          session_id: `summary-${Date.now()}`,
          user_id: "system-summarizer",
          data: {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.reply) {
          return data.reply.trim().replace(/^"|"$/g, ""); // Dọn dẹp ngoặc kép
        }
      }
    } catch (err) {
      this.logger.error("Failed to generate title from AI", err);
    }
    // Fallback if AI summarization fails
    return prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
  }

  async getSessions(userId: string) {
    const { data, error } = await (this.supabase.admin.from("ai_chat_sessions" as any) as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      this.logger.error("Error fetching sessions", error);
      throw new Error("Không thể tải danh sách phiên.");
    }
    return data;
  }

  async getMessages(sessionId: string) {
    const { data, error } = await (this.supabase.admin.from("ai_chat_messages" as any) as any)
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      this.logger.error("Error fetching messages", error);
      throw new Error("Không thể tải tin nhắn.");
    }
    return data;
  }

  async deleteSession(sessionId: string) {
    const { error } = await (this.supabase.admin.from("ai_chat_sessions" as any) as any)
      .delete()
      .eq("id", sessionId);

    if (error) {
      this.logger.error("Error deleting session", error);
      throw new Error("Không thể xóa phiên.");
    }
    return { success: true };
  }

  async chat(userId: string, prompt: string, sessionId?: string): Promise<{ reply: string; session_id: string }> {
    const apiUrl = process.env.CODING_API_URL || process.env.PICOCLAW_API_URL;
    const apiKey = process.env.CODING_API_KEY || process.env.PICOCLAW_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("PICOCLAW API credentials are not configured.");
    }

    let activeSessionId = sessionId;

    // Create session if not exists
    if (!activeSessionId) {
      const title = await this.generateTitle(prompt);
      const { data: sessionData, error: sessionErr } = await (this.supabase.admin.from("ai_chat_sessions" as any) as any)
        .insert({ user_id: userId, title })
        .select()
        .single();

      if (sessionErr || !sessionData) {
        this.logger.error("Error creating session", sessionErr);
        throw new Error("Không thể khởi tạo phiên trò chuyện.");
      }
      activeSessionId = sessionData.id;
    }

    // Save user message
    await (this.supabase.admin.from("ai_chat_messages" as any) as any).insert({
      session_id: activeSessionId,
      role: "user",
      content: prompt,
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: prompt,
        session_id: activeSessionId,
        user_id: userId,
        data: {},
      }),
    });

    if (!response.ok) {
        throw new Error(`PicoClaw API error: ${response.status}`);
    }

    const data: PicoclawResponse = await response.json();

    if (data.status !== "success") {
      this.logger.warn(`PicoClaw returned non-success status: ${data.status}`);
      throw new Error("PicoClaw AI không thể xử lý yêu cầu.");
    }

    // Save AI reply
    await (this.supabase.admin.from("ai_chat_messages" as any) as any).insert({
      session_id: activeSessionId,
      role: "assistant",
      content: data.reply,
    });

    return { reply: data.reply, session_id: activeSessionId };
  }
}
