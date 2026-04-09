# Tài liệu BD (Basic Design) - Thiết kế Cơ bản, Kiến trúc và Cài đặt

## 1. Kiến trúc Hệ thống (System Architecture)
CodeMastery được tổ chức theo kiến trúc **Monorepo** nhằm dễ dàng dùng chung mã nguồn (Types, DTOs, Utils) giữa client và server.

### 1.1. Kiến trúc Tổng thể (High-level Architecture)
Hệ thống bao gồm 3 lớp chính (Client Layer, Application Server Layer, Data/Service Layer).
- **Frontend (Lớp Trình diễn - Presentation Layer):** 
  - Khung làm việc: Next.js 14 (Sử dụng App Router).
  - Kiến trúc thành phần: Feature-Sliced Design (FSD) giúp chia rẽ module mạch lạc (auth, learning, ai...).
- **Backend (Lớp Ứng dụng - Business Logic Layer):**
  - Khung làm việc: NestJS (thiết kế theo mô hình Modular Monolith). Mô hình này chia mã nguồn thành các module độc lập bên trong một ứng dụng duy nhất, có thể dễ dàng tách thành Microservices (như `ExecutionService`, `AIService`) nếu lưu lượng hệ thống mở rộng.
- **Hạ tầng Dữ liệu (Infrastructure Layer):**
  - Cơ sở dữ liệu: PostgreSQL, được lưu trữ và bọc qua Supabase (BaaS). Trực tiếp quản lý Auth, Row Level Security (RLS), và Real-time WebSockets.
  - Phân hệ bên thứ ba (3rd Party APIs): Piston API/Client Execution Engine (Code Sandbox) và Google Gemini API (LLM).

## 2. Thiết kế Cơ sở dữ liệu (Database Schema / ERD)
Cấu trúc dữ liệu quan hệ được lập trình trên PostgreSQL thông qua Supabase.

### 2.1. Các bảng (Tables) cốt lõi
1. **users:** Lưu thông tin tài khoản, UUID (PK), role (student/admin), thông tin cá nhân.
2. **courses:** Chứa dữ liệu danh mục khóa học. Trường (PK) id, (FK) category_id, title, description, status.
3. **lessons:** Bài học hoặc bài thực hành. Lấy (FK) course_id làm ràng buộc cơ sở.
4. **user_progress:** Lưu lại tiến độ (XP, cấp độ, số khóa học hoàn thành) cho hệ thống Gamification. Phủ (FK) user_id, (FK) lesson_id, trạng thái (đã qua/chưa qua).
5. **classroom_messages:** Lưu trữ lịch sử tin nhắn trong kênh lớp học thực tế. (FK) user_id, (FK) course_id, message_body.

## 3. Hướng dẫn Cài đặt Môi trường (Installation & Setup Guide)
Mục lục này dành cho kỹ sư hoặc các thành viên hội đồng muốn biên dịch và thiết lập nhanh ứng dụng cục bộ (Local Environment).

### 3.1. Yêu cầu hệ thống (Prerequisites)
- Node.js bản v18.17.0 trở lên.
- Trình quản lý gói phần mềm: `npm` hoặc `yarn`.
- Git.
- Tài khoản Supabase, Tài khoản Google AI Studio (Lấy Gemini API Key).

### 3.2. Quá trình thiết lập (Setup Process)
**Bước 1: Tải mã nguồn**
```bash
git clone https://github.com/your-org/codemastery.git
cd codemastery
```

**Bước 2: Cài đặt gói phụ thuộc toàn cục (Monorepo)**
```bash
npm install
```

**Bước 3: Thiết lập biến môi trường (.env)**
Tại thư mục gốc của frontend (`apps/frontend/`) và backend (`apps/backend/`), tạo file `.env.local` theo mẫu `.env.example`:
```env
# Frontend .env
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"

# Backend .env
PORT=4000
GOOGLE_GEMINI_API_KEY="your-gemini-key"
```

**Bước 4: Khởi chạy môi trường Phát triển (Dev Mode)**
Hỗ trợ chạy đồng thời cả Frontend và Backend từ thư mục gốc nhờ công cụ quản lý workspace (Turborepo hoặc npm workspaces).
```bash
npm run dev
```

Hệ thống sẽ hoạt động tại các địa chỉ:
- Frontend Client: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`

### 3.3. Câu lệnh hỗ trợ
- Sinh lại Database Types (Supabase Typegen): `npm run generate:types`
- Kiểm tra lỗi (Linter) và Formatting: `npm run lint` & `npm run format`
