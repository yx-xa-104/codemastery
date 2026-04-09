# Tài liệu ED (External Design) - Thiết kế Giao diện & API

## 1. Thiết kế UX/UI (User Experience / User Interface)
Giao diện của CodeMastery được thiết kế dựa trên triết lý **Modern, Accessible & Focus-driven**. Giao diện áp dụng các tiêu chuẩn thiết kế mới nhất của Web System.

### 1.1. Design System & Typography
- **Thư viện UI cốt lõi:** Shadcn UI (được tùy chỉnh sâu bằng Tailwind CSS).
- **Màu sắc chủ đạo (Color Palette):**
  - Primary Background: Chế độ nền tối (Dark mode ưu tiên) mã `#0f172a` (Slate 900) giảm mỏi mắt khi lập trình lâu.
  - Accent Color: Màu gradient chủ đề năng động hoặc Ocean Blue nổi bật các Call-to-action (CTA).
- **Font chữ:** `Inter` cho text hiển thị thông thường, `Fira Code` hoặc `JetBrains Mono` cho font chữ trong Editor.

### 1.2. Luồng màn hình (Screen Flows) 
*Đây là văn bản đại diện cho luồng di chuyển của các Wireframe (đã được vẽ bằng công cụ Figma/Draw.io).*

- **Luồng 1 - Onboarding:**
  `Landing Page` => `Đăng nhập/Đăng ký` => `User Dashboard` (Hiển thị Tiến trình, Khóa Học Pinned).
- **Luồng 2 - Trải nghiệm Bài học (Core):**
  `Course Catalog` => `Course Detail` => `Learning Workspace (Split View)`.
  *Workspace chia màn hình làm 2 phần:* 
    - *Trái:* Nội dung MDX bài giảng.
    - *Phải:* Monaco Code Editor & Terminal Emulator.
- **Luồng 3 - Classroom / Thảo luận:**
  `Dashboard` => `Lớp học (Classroom)` => `Drawer Thảo luận nhóm (Real-time Chat)`.

---

## 2. Thiết kế API Hệ Thống (External Interfaces)
Các API được thiết kế theo chuẩn RESTful tại NestJS Backend, dữ liệu trả về với định dạng JSON.

### 2.1. API - Phân hệ Thực thi mã (Code Execution)
Xử lý việc đẩy mã nguồn của học sinh vào Sandbox để kiểm thử.

```markdown
### POST /api/v1/execution/run

Thực thi đoạn mã với ngôn ngữ được chỉ định.

**Request Body (JSON):**
| Name      | Type   | Required | Description                     |
| :-------- | :----- | :------- | :------------------------------ |
| language  | string | Yes      | Ngôn ngữ (python, js, java, cpp)|
| code      | string | Yes      | Nội dung mã nguồn               |
| stdin     | string | No       | Đầu vào chuẩn cho test case     |

**Response (200 OK):**
```json
{
  "status": "success",
  "output": "Hello World\n",
  "executionTime": "12ms",
  "error": null
}
```
```

### 2.2. API - Phân hệ Gia sư AI (AI Tutor)
Đóng gói ngữ cảnh hệ thống và giao tiếp với Gemini LLM. Trả về dưới dạng Stream.

```markdown
### POST /api/v1/ai/tutor/explain

Giải thích lý thuyết, gợi ý thuật toán hoặc debug lỗi mã nguồn.

**Request Body (JSON):**
| Name       | Type   | Required | Description                        |
| :--------- | :----- | :------- | :--------------------------------- |
| context    | string | Yes      | Mã nguồn và nội dung bài học     |
| errorTrace | string | No       | Dòng báo lỗi (nếu người dùng chạy lỗi) |
| userQuery  | string | Yes      | Câu hỏi/yêu cầu của sinh viên      |

**Response (200 SSE - Server Sent Events):**
- Trả về dạng luồng dữ liệu (streaming chunks) để hiển thị chữ dần dần như ChatGPT nhầm giảm độ trễ trải nghiệm.
```

### 2.3. API - Phân hệ Thảo luận thời gian thực (Classroom Subscription)
Sử dụng công nghệ WebSockets hoặc Supabase Real-time thay cho REST HTTP.
- **Kênh (Channel):** `classroom_<id>`
- **Sự kiện (Events):** `INSERT`, `UPDATE` trên bảng `classroom_messages`.
- **Payload:** Message content, sender_id (ẩn danh với sinh viên khác), timestamp.

## 3. Liên kết bên ngoài (3rd Party Integrations)
- **Supabase Auth:** Xử lý xác thực người dùng ngoài và cấp phát JWT token.
- **Strapi CMS (Tùy chọn):** Nền tảng quản lý nội dung độc lập nếu không dùng MDX nội bộ.
- **Google AI Studio (Gemini 1.5 Pro/Flash):** Cung cấp Endpoint cho các tính năng Intelligence.
