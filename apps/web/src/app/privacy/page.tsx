import { MainLayout } from "@/components/layouts/MainLayout";

export default function PrivacyPage() {
    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                    <h1 className="text-3xl font-bold text-white mb-2">Chính sách Bảo mật</h1>
                    <p className="text-slate-400 text-sm mb-10">Cập nhật lần cuối: 01/03/2026</p>

                    {[
                        {
                            title: "1. Thông tin chúng tôi thu thập",
                            content: "Chúng tôi thu thập thông tin bạn cung cấp trực tiếp, bao gồm họ tên, địa chỉ email khi đăng ký tài khoản. Chúng tôi cũng thu thập dữ liệu về hoạt động học tập như tiến độ bài học, điểm số bài tập để cải thiện trải nghiệm học tập của bạn."
                        },
                        {
                            title: "2. Cách chúng tôi sử dụng thông tin",
                            content: "Thông tin thu thập được sử dụng để: cung cấp và cải thiện dịch vụ, gửi thông báo về tiến độ học tập, cá nhân hóa trải nghiệm học, phân tích và cải thiện nền tảng, và liên lạc về các thay đổi dịch vụ."
                        },
                        {
                            title: "3. Chia sẻ thông tin",
                            content: "Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân với bên thứ ba. Chúng tôi có thể chia sẻ thông tin tổng hợp, không nhận dạng được với đối tác để phân tích xu hướng học tập."
                        },
                        {
                            title: "4. Bảo mật dữ liệu",
                            content: "Chúng tôi sử dụng mã hóa SSL/TLS cho tất cả dữ liệu transmission. Mật khẩu được hash với bcrypt. Dữ liệu được lưu trữ trên Supabase với Row Level Security đảm bảo chỉ bạn mới truy cập được dữ liệu của mình."
                        },
                        {
                            title: "5. Cookie",
                            content: "Chúng tôi sử dụng cookie để duy trì phiên đăng nhập và ghi nhớ tùy chọn của bạn. Bạn có thể tắt cookie trong trình duyệt nhưng điều này có thể ảnh hưởng đến chức năng của nền tảng."
                        },
                        {
                            title: "6. Quyền của bạn",
                            content: "Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Bạn cũng có thể yêu cầu xuất dữ liệu hoặc ngừng nhận email marketing bất cứ lúc nào."
                        },
                    ].map(({ title, content }) => (
                        <section key={title} className="mb-8">
                            <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
                            <p className="text-slate-400 leading-relaxed">{content}</p>
                        </section>
                    ))}

                    <div className="mt-10 p-5 bg-[#0B1120] border border-indigo-900/30 rounded-xl">
                        <p className="text-sm text-slate-400">
                            Liên hệ về vấn đề bảo mật:{" "}
                            <a href="mailto:privacy@codemastery.vn" className="text-indigo-400 hover:text-indigo-300">privacy@codemastery.vn</a>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
