"use client";

import { useState } from "react";
import { CheckCircle, XCircle, HelpCircle, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface QuizOption {
    id: string;
    option_text: string;
    is_correct: boolean;
    sort_order: number;
}

interface QuizQuestion {
    id: string;
    question_text: string;
    sort_order: number;
    quiz_options: QuizOption[];
}

interface QuizPanelProps {
    questions: QuizQuestion[];
    onQuizComplete?: (allCorrect: boolean) => void;
}

export function QuizPanel({ questions, onQuizComplete }: QuizPanelProps) {
    const [selected, setSelected] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelect = (questionId: string, optionId: string) => {
        if (submitted) return;
        setSelected(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach(q => {
            const selectedOptionId = selected[q.id];
            const correctOption = q.quiz_options.find(o => o.is_correct);
            if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
                correct++;
            }
        });
        setScore(correct);
        setSubmitted(true);
        onQuizComplete?.(correct === questions.length);
    };

    const handleRetry = () => {
        setSelected({});
        setSubmitted(false);
        setScore(0);
    };

    const allAnswered = questions.every(q => selected[q.id]);
    const allCorrect = submitted && score === questions.length;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    Trắc nghiệm ({questions.length} câu)
                </div>
                {submitted && (
                    <div className={`flex items-center gap-2 text-sm font-bold ${allCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <Trophy className="w-4 h-4" />
                        {score}/{questions.length}
                    </div>
                )}
            </div>

            {/* Questions */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {questions.map((q, qi) => {
                    const selectedOptionId = selected[q.id];
                    const correctOption = q.quiz_options.find(o => o.is_correct);
                    const isCorrect = submitted && selectedOptionId === correctOption?.id;
                    const isWrong = submitted && selectedOptionId && selectedOptionId !== correctOption?.id;

                    return (
                        <div key={q.id} className="space-y-3">
                            <h3 className="text-sm font-bold text-white flex items-start gap-2">
                                <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                    submitted
                                        ? isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : isWrong ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                                }`}>
                                    {submitted ? (isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : isWrong ? <XCircle className="w-3.5 h-3.5" /> : qi + 1) : qi + 1}
                                </span>
                                <span className="pt-0.5">{q.question_text}</span>
                            </h3>

                            <div className="space-y-2 pl-9">
                                {q.quiz_options.map(opt => {
                                    const isSelected = selectedOptionId === opt.id;
                                    const showCorrect = submitted && opt.is_correct;
                                    const showWrong = submitted && isSelected && !opt.is_correct;

                                    let optionClass = 'bg-navy-900/50 border-slate-700/60 text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/5 cursor-pointer';
                                    if (isSelected && !submitted) {
                                        optionClass = 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 ring-1 ring-indigo-500/20';
                                    }
                                    if (showCorrect) {
                                        optionClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                                    }
                                    if (showWrong) {
                                        optionClass = 'bg-red-500/10 border-red-500/40 text-red-300 line-through';
                                    }
                                    if (submitted) {
                                        optionClass += ' cursor-default';
                                    }

                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(q.id, opt.id)}
                                            disabled={submitted}
                                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${optionClass}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                                                    showCorrect ? 'border-emerald-400 bg-emerald-400'
                                                    : showWrong ? 'border-red-400 bg-red-400'
                                                    : isSelected && !submitted ? 'border-indigo-400 bg-indigo-400'
                                                    : 'border-slate-600'
                                                }`}>
                                                    {(isSelected || showCorrect) && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span>{opt.option_text}</span>
                                                {showCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
                                                {showWrong && <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-800 shrink-0">
                {!submitted ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Kiểm tra đáp án
                    </Button>
                ) : allCorrect ? (
                    <div className="text-center py-2">
                        <p className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                            <Trophy className="w-5 h-5 fill-emerald-400" />
                            Xuất sắc! Bạn trả lời đúng tất cả!
                        </p>
                    </div>
                ) : (
                    <Button
                        onClick={handleRetry}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Thử lại ({score}/{questions.length} đúng)
                    </Button>
                )}
            </div>
        </div>
    );
}
