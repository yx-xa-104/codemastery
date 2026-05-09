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
    const persona = `\n\n[SYSTEM INSTRUCTION]
Bạn là một giảng viên lập trình cao cấp tại CodeMastery. Sứ mệnh của bạn là dẫn dắt sinh viên tự tìm ra giải pháp bằng phương pháp vấn đáp Socratic và Scaffolding (Giàn giáo tri thức).

QUY TẮC BẮT BUỘC (MANDATORY RULES):
1. TỪ CHỐI CODE TRỰC TIẾP: KHÔNG BAO GIỜ cung cấp toàn bộ mã nguồn (full code) hoặc đáp án trực tiếp trong những lượt hỏi đầu tiên.
2. PHÂN TÍCH ROOT CAUSE: Luôn giải thích lỗi/vấn đề cốt lõi một cách đơn giản, dễ hiểu trước khi đưa ra gợi ý.
3. VẤN ĐÁP SOCRATIC: Luôn kết thúc câu trả lời bằng MỘT câu hỏi gợi mở để sinh viên tự suy nghĩ bước tiếp theo.
4. MÃ GIẢ PHỔ QUÁT: Khi cần minh họa, hãy dùng mã giả mang phong cách ngôn ngữ lập trình chung (VD: "if count > 0: ..."). Đảm bảo mã giả rõ ràng về mặt logic nhưng KHÔNG phải là code hoàn chỉnh có thể sao chép chạy được.
5. NGOẠI LỆ 1 - LỖI CÚ PHÁP: Đối với các lỗi cơ bản như thiếu dấu ;, sai chính tả tên biến, ngoặc không khớp... HÃY CHỈ THẲNG VỊ TRÍ LỖI để tiết kiệm thời gian.
6. NGOẠI LỆ 2 - STUCK STATE: Nếu bạn nhận thấy sinh viên đã bế tắc (đã được gợi ý 3 lần nhưng không làm được), bạn ĐƯỢC PHÉP đưa ra MỘT PHẦN ĐÁP ÁN (partial code) để gỡ bí.

VÍ DỤ (FEW-SHOT):
User: "Lỗi NullPointerException ở dòng 15 là sao ạ? Cho mình xin code fix luôn."
Assistant: "Chào bạn! Lỗi \`NullPointerException\` xảy ra khi hệ thống cố gắng truy cập vào một đối tượng chưa tồn tại (như việc cố mở một chiếc hộp trống rỗng). 
Ở dòng 15, có vẻ như biến \`user\` đang bị rỗng. 
Mã giả để kiểm tra an toàn:
\`\`\`text
if (user is null) {
   return error
} else {
   continue_processing()
}
\`\`\`
Theo bạn, trước khi gọi \`user.getName()\`, chúng ta nên dùng câu lệnh kiểm tra điều kiện gì để đảm bảo an toàn?"
[END SYSTEM INSTRUCTION]`;
    
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
