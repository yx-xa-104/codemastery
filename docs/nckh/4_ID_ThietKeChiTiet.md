# Tài liệu ID (Internal Design) - Thiết kế Logic lõi chi tiết

Tài liệu này đi sâu vào logic xử lý hệ thống (Internal Processes) của các module phức tạp và mang hàm lượng khoa học cao nhất của hệ thống: Tích hợp AI và Hệ thống giả lập phân giải mã (Code Sandbox).

## 1. Phân hệ Gia sư Trí tuệ Nhân tạo (AI Tutor Engine)

### 1.1. Luồng xử lý giao tiếp LLM (Data Flow)
Mô hình ngôn ngữ lớn (Gemini 1.5) được giao tiếp thông qua một Service trừu tượng ở NestJS Backend, có nhiệm vụ "khóa" prompt (System Prompt Injection Prevention) để sinh viên không thể lợi dụng AI làm bài giúp.

**Quy trình (Sequence Steps):**
1. Người dùng làm sai bài tập, ấn nút "Hỏi AI lý do sai".
2. **Frontend Layer:** `AITutorStore` (Zustand) tự động lấy (1) Yêu cầu của user bài toán hiện hành, (2) Mã nguồn hiện tại trong code editor, (3) Thông báo lỗi (stderr).
3. Gửi Request (`POST /api/ai/tutor/explain`) đến Backend.
4. **Backend Layer (AIService):** Dùng Template Prompt bọc các thông tin trên lại, cộng thêm System Instruction: *"Bạn là gia sư. Nhiệm vụ của bạn là giải thích ngữ nghĩa của lỗi và gợi ý thuật toán, TUYỆT ĐỐI KHÔNG cung cấp sẵn mã nguồn (code) giải đáp hoàn chỉnh cho sinh viên."*
5. Gửi lên Google Gemini API.
6. Gemini phản hồi dạng Stream liên tục từng luồng chữ. `AIService` trả dữ liệu ngược thông qua chuẩn SSE (Server-Sent Events) giúp giao diện người dùng hiển thị chữ gõ một cách mượt mà và không có độ trễ timeout.

### 1.2. Mã giả thuật toán gọi AI (Pseudo Code)

```typescript
// Lớp AIService (Trong khung làm việc NestJS)
async function explainError(context: CodeContext, error: string): StreamedResponse {
    const systemInstruction = 
      "As an AI tutor, analyze the code and the error. Provide hints, not the exact answer.";
    const userPrompt = 
      `Code: ${context.sourceCode}\nError: ${error}\nLesson Goal: ${context.lessonGoal}`;

    try {
        const stream = await this.geminiClient.generateContentStream({
            systemInstruction: systemInstruction,
            prompt: userPrompt
        });
        return stream; // Đưa vào Controller xử lý HTTP luồng Chunk
    } catch (apiError) {
        throw new Error("Lỗi kết nối với mô hình Ngôn ngữ AI.");
    }
}
```

## 2. Phân hệ Biên dịch Mã nguồn (Code Execution Sandbox)

Không giống như các hệ thống học liệu tĩnh thông thường, hệ thống của CodeMastery hỗ trợ người dùng tự viết mã lập trình trên trình duyệt và nhận được kết quả (output). Điều này đòi hỏi thuật toán an toàn cấp máy chủ.

### 2.1. Đảm bảo An ninh Vùng cách ly (Security Measures)
- Không bao giờ gọi hàm `eval()` đối với nội dung mã JS trong code base hệ thống.
- Các yêu cầu chạy Code được xử lý qua API của bên thứ 3 (Piston API - Hệ thống chạy Container Docker riêng biệt cho từng khối code) hoặc các WebWorker giả lập bên trong Client để ngăn mã độc truy cập Main Thread.
- **Ràng buộc:** Thời gian chạy tối đa (Timeout = 5s), kích thước file truyền vào tối đa.

### 2.2. Luồng thực thi Code (Execution Pipeline)
1. User nhấn "Run Code".
2. Hệ thống bóc tách Input (stdin) của các test case ẩn và nối cùng với mã nguồn ngôn ngữ tương ứng.
3. Chuyển đổi mã thông báo định dạng JSON đưa vào `ExecutionService`.
4. Gọi tới Sandbox Container. Container thiết lập môi trường (ví dụ Node.js, Python), nạp đoạn code và thực thi độc lập.
5. So sánh `stdout` trả về với `Expected Output` (kết quả mong đợi).
6. Tính điểm (Gamification system xử lý XP thông qua `PointsService`).

### 2.3. Sử dụng Zustand (Frontend State)
Quản lý trạng thái CodeEditor đồng bộ.

```typescript
// useEditorStore.ts (State Manager Next.js Client)
interface EditorState {
  code: string;
  language: 'javascript' | 'python' | 'cpp';
  output: string;
  isLoading: boolean;
  setCode: (newVal: string) => void;
  executeCode: () => Promise<void>;
}

// Logic: executeCode() sẽ được gán biến isLoading = true, 
// call API /api/execution, sau đó update state `output` và render UI thay đổi.
```
