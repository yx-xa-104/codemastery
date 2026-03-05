import { MainLayout } from "@/components/layouts/MainLayout";

export default function TermsPage() {
    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                    <h1 className="text-3xl font-bold text-white mb-2">Điều khoản Sử dụng</h1>
                    <p className="text-slate-400 text-sm mb-10">Cập nhật lần cuối: 01/03/2026</p>

                    {[
                        {
                            title: "1. Chấp nhận điều khoản",
                            content: "Bằng cách truy cập và sử dụng CodeMastery, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, bạn không được phép sử dụng dịch vụ của chúng tôi."
                        },
                        {
                            title: "2. Tài khoản người dùng",
                            content: "Bạn chịu trách nhiệm về việc duy trì tính bảo mật của tài khoản và mật khẩu của mình. CodeMastery không chịu trách nhiệm về bất kỳ tổn thất hoặc thiệt hại nào phát sinh từ việc bạn không bảo vệ thông tin đăng nhập của mình."
                        },
                        {
                            title: "3. Nội dung học tập",
                            content: "Tất cả nội dung trên CodeMastery, bao gồm nhưng không giới hạn ở bài giảng, bài tập, và tài liệu, được bảo vệ bởi bản quyền. Bạn không được sao chép, phân phối hoặc tạo ra các sản phẩm phái sinh từ nội dung này mà không có sự cho phép bằng văn bản."
                        },
                        {
                            title: "4. Hành vi người dùng",
                            content: "Bạn đồng ý không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc bị cấm bởi các điều khoản này. Bao gồm việc không quấy rối, lạm dụng hoặc gây hại cho người dùng khác, không đăng tải nội dung bất hợp pháp, phản cảm hoặc vi phạm quyền sở hữu trí tuệ."
                        },
                        {
                            title: "5. Thanh toán và hoàn tiền",
                            content: "Phí dịch vụ được thanh toán trước và không hoàn lại. CodeMastery có quyền thay đổi giá của bất kỳ dịch vụ nào bất cứ lúc nào mà không cần thông báo trước."
                        },
                        {
                            title: "6. Giới hạn trách nhiệm",
                            content: "CodeMastery không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, do hậu quả hoặc mang tính trừng phạt nào, bao gồm mà không giới hạn, mất lợi nhuận, dữ liệu, thiện chí, sử dụng dịch vụ."
                        },
                        {
                            title: "7. Thay đổi điều khoản",
                            content: "Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng các điều khoản mới trên trang này. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận các điều khoản mới."
                        },
                    ].map(({ title, content }) => (
                        <section key={title} className="mb-8">
                            <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
                            <p className="text-slate-400 leading-relaxed">{content}</p>
                        </section>
                    ))}

                    <div className="mt-10 p-5 bg-[#0B1120] border border-indigo-900/30 rounded-xl">
                        <p className="text-sm text-slate-400">
                            Nếu bạn có câu hỏi về Điều khoản Sử dụng này, vui lòng liên hệ:{" "}
                            <a href="mailto:legal@codemastery.vn" className="text-indigo-400 hover:text-indigo-300">legal@codemastery.vn</a>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
