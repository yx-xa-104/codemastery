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
    if (!userId || userId === 'anonymous') return [];

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

  async chat(userId: string, prompt: string, sessionId?: string, metadata?: any): Promise<{ reply: string; session_id: string }> {
    const apiUrl = process.env.CODING_API_URL || process.env.PICOCLAW_API_URL;
    const apiKey = process.env.CODING_API_KEY || process.env.PICOCLAW_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("PICOCLAW API credentials are not configured.");
    }

    let activeSessionId = sessionId;
    const isAnonymous = !userId || userId === 'anonymous';

    // Create session if not exists
    if (!activeSessionId) {
      if (isAnonymous) {
        activeSessionId = `anon-${Date.now()}`;
      } else {
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
    }

    // Save user message (only if logged in)
    if (!isAnonymous) {
      await (this.supabase.admin.from("ai_chat_messages" as any) as any).insert({
        session_id: activeSessionId,
        role: "user",
        content: prompt,
      });
    }

    // Prepare hidden context for AI engine
    let finalPrompt = prompt;
    const persona = `\n\n[SYSTEM INSTRUCTION]\nBạn là một giảng viên lập trình cao cấp tại CodeMastery. Khác với các AI khác, bạn KHÔNG ĐƯỢC quá khắt khe trong việc giấu code. Nếu người dùng hỏi xin code, hãy sẵn sàng cung cấp mã nguồn đúng cho họ, nhưng bắt buộc phải kèm theo những phân tích, giải thích chi tiết, sâu sắc như một người thầy tận tâm để giúp họ thật sự hiểu bản chất vấn đề.\n[END SYSTEM INSTRUCTION]`;
    
    if (metadata) {
      const contextStr = `\n\n[SYSTEM CONTEXT - DO NOT SHOW TO USER]\nUser is currently viewing page: ${metadata.path || 'unknown'}\nActive Code in Editor:\n\`\`\`\n${metadata.code || '(no code present)'}\n\`\`\`\n[END CONTEXT]`;
      finalPrompt = prompt + contextStr + persona;
    } else {
      finalPrompt = prompt + persona;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: finalPrompt,
        session_id: activeSessionId,
        user_id: userId,
        data: metadata || {},
      }),
    });

    if (!response.ok) {
        throw new Error(`PicoClaw API error: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.status !== "success") {
      this.logger.warn(`PicoClaw returned non-success status: ${data.status}`);
      throw new Error("AI Tutor không thể xử lý yêu cầu.");
    }

    // PicoClaw API might separate code blocks into an array. Reconstruct the full markdown string:
    let fullReply = data.reply || "";
    const snippets = data.code_snippets || (data.analysis_data && data.analysis_data.code_snippets);
    
    if (snippets && Array.isArray(snippets) && snippets.length > 0) {
      snippets.forEach((snippet: any) => {
        const lang = snippet.language || "text";
        const code = snippet.code || "";
        if (code) {
          fullReply += `\n\n\`\`\`${lang}\n${code}\n\`\`\``;
        }
      });
    }

    // Save AI reply (only if logged in)
    if (!isAnonymous) {
      await (this.supabase.admin.from("ai_chat_messages" as any) as any).insert({
        session_id: activeSessionId,
        role: "assistant",
        content: fullReply,
      });
    }

    return { reply: fullReply, session_id: activeSessionId };
  }
}
