import { MainLayout } from "@/components/layouts/MainLayout";
import Link from "next/link";

export default function RefundPage() {
    return (
        <MainLayout>
            <div className="min-h-screen bg-[#010816]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                    <h1 className="text-3xl font-bold text-white mb-2">Chính sách Hoàn tiền</h1>
                    <p className="text-slate-400 text-sm mb-10">Cập nhật lần cuối: 01/03/2026</p>

                    {/* Highlight box */}
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 mb-8">
                        <p className="text-green-300 font-semibold text-sm">✅ Cam kết hoàn tiền 100% trong vòng 7 ngày</p>
                        <p className="text-slate-400 text-sm mt-1">Nếu bạn không hài lòng với khóa học, chúng tôi sẽ hoàn trả toàn bộ số tiền đã thanh toán trong vòng 7 ngày kể từ ngày mua.</p>
                    </div>

                    {[
                        {
                            title: "Điều kiện hoàn tiền",
                            items: [
                                "Yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày mua",
                                "Chưa hoàn thành quá 20% nội dung khóa học",
                                "Không vi phạm điều khoản sử dụng",
                                "Mỗi tài khoản chỉ được hoàn tiền tối đa 2 lần",
                            ]
                        },
                        {
                            title: "Quy trình hoàn tiền",
                            items: [
                                "Gửi email đến support@codemastery.vn với tiêu đề 'Yêu cầu hoàn tiền'",
                                "Đính kèm mã đơn hàng và lý do hoàn tiền",
                                "Đội ngũ hỗ trợ sẽ xem xét trong vòng 24 giờ làm việc",
                                "Tiền sẽ được hoàn vào phương thức thanh toán ban đầu trong 5-10 ngày làm việc",
                            ]
                        },
                        {
                            title: "Không áp dụng hoàn tiền khi",
                            items: [
                                "Đã sử dụng chứng chỉ hoàn thành khóa học",
                                "Tải xuống tài liệu khóa học (nếu có)",
                                "Đã yêu cầu hoàn tiền trước đó cho cùng khóa học",
                                "Vi phạm điều khoản sử dụng của CodeMastery",
                            ]
                        },
                    ].map(({ title, items }) => (
                        <section key={title} className="mb-8">
                            <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
                            <ul className="space-y-2">
                                {items.map(item => (
                                    <li key={item} className="flex items-start gap-2.5 text-slate-400 text-sm">
                                        <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    <div className="mt-10 p-5 bg-[#0B1120] border border-indigo-900/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-white">Cần hỗ trợ hoàn tiền?</p>
                            <p className="text-xs text-slate-400 mt-0.5">Liên hệ ngay, đội ngũ phản hồi trong 24h</p>
                        </div>
                        <a href="mailto:support@codemastery.vn"
                            className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
                            Gửi yêu cầu
                        </a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
