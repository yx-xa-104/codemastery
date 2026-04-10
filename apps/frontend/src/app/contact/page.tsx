import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const metadata = {
    title: "Liên hệ | CodeMastery",
    description: "Liên hệ với đội ngũ hỗ trợ của CodeMastery.",
};

export default function ContactPage() {
    return (
        <MainLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl lg:text-4xl font-bold font-heading text-foreground mb-4">
                            Liên Hệ Với Chúng Tôi
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Bạn có câu hỏi, thắc mắc hoặc góp ý? Đừng ngần ngại liên hệ với đội ngũ CodeMastery. Chúng tôi luôn sẵn sàng hỗ trợ bạn.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Phương thức liên hệ */}
                        <div className="space-y-8">
                            <div className="p-8 rounded-2xl bg-navy-900 border border-slate-800">
                                <h3 className="text-xl font-bold text-foreground mb-6">Thông Tin Liên Hệ</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Email</p>
                                            <a href="mailto:anngo1755@gmail.com" className="text-slate-400 hover:text-indigo-400 transition-colors">
                                                anngo1755@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Điện thoại</p>
                                            <a href="tel:0362029216" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                                0362029216
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Văn phòng</p>
                                            <p className="text-slate-400">
                                                Học viện Hành chính và Quản trị công<br />
                                                36 Xuân La Tây Hồ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form liên hệ */}
                        <div className="p-8 rounded-2xl bg-navy-950 border border-slate-800">
                            <h3 className="text-xl font-bold text-foreground mb-6">Gửi Tin Nhắn</h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-slate-300">Họ và tên</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            placeholder="Nguyễn Văn A"
                                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            placeholder="example@gmail.com"
                                            className="w-full px-4 py-2.5 rounded-xl bg-background border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-slate-300">Chủ đề</label>
                                    <input 
                                        type="text" 
                                        id="subject" 
                                        placeholder="Bạn cần hỗ trợ gì?"
                                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-slate-300">Nội dung</label>
                                    <textarea 
                                        id="message" 
                                        rows={5}
                                        placeholder="Nhập nội dung tin nhắn..."
                                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-foreground resize-none"
                                    ></textarea>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 mt-2 rounded-xl h-auto">
                                    <Send className="w-4 h-4 mr-2" />
                                    Gửi Tin Nhắn
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
