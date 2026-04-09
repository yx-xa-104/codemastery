# Tài liệu Hướng dẫn sử dụng Hệ thống (User Manual) CodeMastery

Tài liệu hướng dẫn thao tác cơ bản dành cho các nhóm người dùng để có thể trải nghiệm toàn vẹn các tính năng của "Công cụ AI hỗ trợ học tập các môn lập trình".

---

## 1. Dành cho Học viên (Sinh viên)

### 1.1 Khởi tạo và Đăng nhập

1. Truy cập vào trang chủ hệ thống tại địa chỉ đã được cung cấp (VD: Localhost:3000 hoặc URL Deploy trên Vercel).
2. Nhấn nút **"Đăng nhập" (Login)** ở góc phải phía trên.
3. Nếu chưa có tài khoản, hãy chuyển sang tab **"Đăng ký" (Register)**. Nhập Email, Mật khẩu và thông tin cá nhân cơ bản.
4. Truy cập màn hình bảng điều khiển **Dashboard** ngay sau khi xác thực thành công.

### 1.2 Học và Thực hành bài tập với AI

Đây là tính năng quan trọng nhất của hệ thống phục vụ mục đích NCKH.

1. Tại bảng điều hướng trái (Sidebar Navigation), chọn mục **Khóa học (Courses)**.
2. Lựa chọn một ngôn ngữ lập trình muốn học (VD: JavaScript Cơ bản). Ấn **"Bắt đầu học"**.
3. Tại giao diện Workspace học tập:
   - **Cột bên trái:** Là khu vực hiển thị nội dung lý thuyết và định nghĩa cấu trúc dữ liệu thuật toán theo từng bài học (đọc từ MDX). Đọc kỹ lý thuyết.
   - **Cột bên phải:** Cửa sổ Code Editor. Học viên cần gõ mã giải thuật dựa trên nội dung lý thuyết cột trái.
4. Sau khi viết code, nhấn nút **"Chạy Code" (Run)** hiển thị ngay trên thanh công cụ của Editor.
   - Quá trình biên dịch sẽ được thực hiện an toàn trên máy chủ Sandbox.
   - Nếu kết quả đầu ra (Target Output) chính xác, bạn sẽ có quyền chuyển qua bài tiếp theo (Next Lesson) và nhận được điểm kinh nghiệm (XP) tính vào tài khoản hệ thống của bạn.
5. **Kích hoạt Gia sư AI (AI Tutor):**
   - Nếu bạn nhấn Run nhưng hệ thống báo lỗi đỏ (Error). Hãy nhấp vào biểu tượng hạt kim cương 🔹 **"Hỏi AI"** xuất hiện ngay cạnh thông báo lỗi.
   - Gia sư AI sẽ hiện một ô chat bên cạnh. Từ ngữ cảnh bị sai, nó sẽ giảng giải nguyên nhân lỗi và gợi ý thuật toán thay thế, _đảm bảo người dùng phải tự logic code lại mà không bị đưa hẳn đáp án hoàn chỉnh._

### 1.3 Sử dụng Lớp học thời gian thực

1. Tại màn hình Dashboard, nhấp vào thẻ **Classroom (Lớp học)**.
2. Đây giống như một phòng Chat, nơi các thành viên đang học cùng một chuỗi bài giảng có thể trao đổi, đặt câu hỏi nhanh cho giảng viên hoặc hỗ trợ lẫn nhau.

---

## 2. Dành cho Giảng viên và Quản trị viên (Admin)

### 2.1 Quản trị Tài khoản Sinh viên

1. Đăng nhập bằng tài khoản được cấp quyền Admin (Role: `admin`).
2. Nhấn vào biểu tượng **Tùy chọn Quản trị (Admin Panel)** tại thanh điều hướng dọc.
3. Vào tab **Khách hàng/Sinh viên (Users)**, quản trị viên có thể xem danh sách thành viên hiện hành hệ thống, khóa (Block) những bình luận chứa lỗi vi phạm tiêu chuẩn hay reset tài khoản.

### 2.2 Đọc chỉ số và Thông kê Hệ thống

1. Truy cập **Dashboard (Biểu đồ Tống quan)**. Trong không gian NCKH, việc đọc chỉ số là cần thiết để tiến hành lấy thông số thực nghiệm (Metrics & Evaluation).
2. Các biểu đồ sẽ đo lượng người dùng tích cực qua các ngày (Heatmap/Streak), ngôn ngữ lập trình được thi nhiều nhất, cũng như tỷ lệ sinh viên sử dụng công cụ AI qua một học kỳ.
3. Giảng viên căn cứ vào những dữ liệu này để điều chỉnh lượng bài giảng nội dung cho các khóa tiếp theo.

> Quản trị viên khi cần liên lạc bảo trì máy chủ sẽ tuân theo **Tài liệu cài đặt và Triển khai** (BD Document), can thiệp trực tiếp đến bảng điều khiển PostgreSQL trên Supabase.
