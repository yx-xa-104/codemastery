# Tài liệu RD (Requirement Definition) - Định nghĩa Yêu cầu và Quy trình

## 1. Thông tin chung về dự án
- **Tên đề tài:** Xây dựng công cụ AI hỗ trợ học tập các môn lập trình cho sinh viên ngành Hệ thống thông tin - Học viện Hành chính và Quản trị công.
- **Mục tiêu:** Xây dựng nền tảng học tập trực tuyến (LMS) có tích hợp bộ biên dịch mã nguồn trực tiếp trên trình duyệt (Code Execution Sandbox) và Gia sư bằng Trí tuệ Nhân tạo (AI Tutor) nhằm hỗ trợ cá nhân hóa quá trình học lập trình.

## 2. Phạm vi hệ thống (System Scope)
Hệ thống cung cấp trải nghiệm trọn vẹn từ lúc sinh viên đăng nhập, học lý thuyết, thực hành viết code và nhận phản hồi lỗi tự động từ AI.
Các giới hạn phạm vi:
- Module Frontend: Giao diện học tập, Code Editor (Monaco).
- Module Backend: Quản lý khóa học, gọi API biên dịch code an toàn, đóng gói Context để giao tiếp với mô hình ngôn ngữ lớn (LLM - Gemini).
- Ngôn ngữ hỗ trợ trọng tâm: JavaScript, Python, C++, Java.

## 3. Quản lý Actor & Quyền hạn
| Actor (Vai trò) | Mô tả & Quyền hạn chính |
| :--- | :--- |
| **Sinh viên** | Đăng ký/đăng nhập, xem tiến độ học tập. Đọc bài học, viết code, chạy thử và gọi AI giải thích lỗi. Hỏi đáp trong lớp học ảo. |
| **Giảng viên** | Tạo khóa học, bài tập. Giám sát tiến độ học sinh, thống kê bài làm, duyệt hoặc phản hồi trao đổi qua tính năng Classroom. |
| **Admin** | Quản trị toàn hệ thống, quản lý users, phân quyền, xem metrics hệ thống và can thiệp nội dung khi cần. |

## 4. Yêu cầu Chức năng (Functional Requirements)

### 4.1. Cốt lõi (Core NCKH Features)
- **FR_01 (Interactive Code Editor):** Cho phép người dùng viết mã nguồn trực tiếp bằng thư viện Monaco Editor, hỗ trợ syntax highlighting và auto-completion.
- **FR_02 (Code Execution):** Cho phép chạy mã nguồn trực tuyến, gửi stdout/stderr hoặc kết quả testcase về giao diện theo thời gian thực (Real-time).
- **FR_03 (AI Tutor Assistant):** Sinh viên có thể gọi AI để giải thích thông báo lỗi hoặc xin gợi ý giải quyết thuật toán khi làm sai. Hệ thống tự động đính kèm bối cảnh (Ngôn ngữ, Mã nguồn hiện hành, Nội dung bài học) cho AI phân tích.
- **FR_04 (Real-time Classroom):** Chat và thảo luận nhóm giữa sinh viên và giảng viên qua WebSockets.

### 4.2. Cơ bản (Base Features)
- **FR_05 (Authentication):** Đăng nhập, đăng ký bằng email/mật khẩu hoặc OAuth (Google, GitHub) thông qua Supabase.
- **FR_06 (Course Management):** Lấy danh sách khóa học, chương trình học (MDX parsing). Theo dõi các khóa học đã ghim (Pinned Courses).
- **FR_07 (Dashboard & Gamification):** Nơi hiển thị thống kê điểm, XP tiến độ, Streak heatmap và các huy hiệu.

## 5. Yêu cầu Phi chức năng (Non-Functional Requirements)
- **NFR_01 (Performance):** Thời gian phản hồi của thao tác gọi AI phải dưới 3 giây (Streaming response). Code Editor phải render trong dưới 500ms.
- **NFR_02 (Security):** Code sinh viên viết sẽ được cách ly bằng Sandbox/Containerize để tránh việc thực thi script độc hại ảnh hưởng đến máy chủ (Server-side rendering protection).
- **NFR_03 (Scalability):** Hệ thống được xây dựng với kiến trúc FSD (Frontend) và Modular Monolith (Backend), dễ dàng trích xuất thành Microservices trong tương lai.
- **NFR_04 (Availability):** Cơ sở dữ liệu và API phải sẵn sàng 99.9%, hỗ trợ caching lớp ngoài.

## 6. Quy trình triển khai phần mềm
Dự án áp dụng mô hình **Agile/Scrum** kết hợp với phương pháp **V-Model** trong việc phát hành tài liệu nghiên cứu:
1. **Phân tích yêu cầu (RD):** Lấy yêu cầu từ việc quan sát khó khăn khi học lập trình của sinh viên.
2. **Thiết kế hệ thống (ED/BD):** Xây dựng Wireframe, ERD Database, phân tách Component theo chuẩn Feature-Sliced Design.
3. **Hiện thực hóa (Implementation - ID):** Phát triển dựa trên Next.js 14, NestJS, kết nối API Gemini.
4. **Kiểm thử (Testing):** Áp dụng AAA Pattern (Arrange-Act-Assert) cho bài toán Unit Test và luồng End-to-End.
